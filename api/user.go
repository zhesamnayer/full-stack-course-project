package api

import (
	"context"
	shared "full-stack-project/Shared"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"os"
	"slices"
	"strconv"
	"time"
)

func (h *Handler) Login(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := c.ShouldBindJSON(&credentials)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrWrongInputs})
		return
	}

	user, err := h.repo.Repo.GetUserInfo(ctx, credentials.Username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrWrongCredentials})
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrWrongCredentials})
		log.Println(err)
		return
	}

	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(TokenLifeTime).Unix(),
	})

	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrJWTTokenGenFailed})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.TokenKey: token})
}

func (h *Handler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.UserLogoutMsg})
}

func (h *Handler) ListUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	users, err := h.repo.Repo.ListUsers(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingUsers})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: users})
}

func (h *Handler) AddUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		Role     string `json:"role"`
	}

	//var user domain.User

	err := c.ShouldBindJSON(&user)
	if err != nil {
		log.Print(err)
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}

	// User verification information
	if user.Username == "" || user.Password == "" || user.Email == "" || user.Role == "" {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}
	// check if the selected role is not valid
	if !slices.Contains(shared.Roles, user.Role) {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrWrongRole})
		return
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(passwordHash)

	err = h.repo.Repo.AddUser(ctx, user.Username, user.Password, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingUser})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkAddingUser})
}

func (h *Handler) UpdateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var user struct {
		ID       uint   `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Role     string `json:"role"`
	}

	err := c.ShouldBind(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}

	err = h.repo.Repo.UpdateUser(ctx, user.ID, user.Username, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrUpdatingUser})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkUpdatingUser})
}

func (h *Handler) DeleteUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	intID, _ := strconv.Atoi(c.Query("id"))

	err := h.repo.Repo.DeleteUser(ctx, uint(intID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrDeletingUser})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkDeletingUser})
}
