package api

import (
	"context"
	shared "full-stack-project/Shared"
	"full-stack-project/repo"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	repo *repo.DBRepository
}

func NewHandler(repo *repo.DBRepository) *Handler {
	return &Handler{
		repo: repo,
	}
}

func (h *Handler) Login(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var cred struct {
		username string
		password string
	}

	err := c.BindJSON(&cred)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrWrongInputs})
		return
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(cred.password), bcrypt.DefaultCost)

	err = h.repo.Repo.CheckUserCredentials(ctx, cred.username, string(passwordHash))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrNotFoundUser})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": "mytoken"})
}

func (h *Handler) Logout(c *gin.Context) {}

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
		UserName string
		Password string
		Email    string
		Role     string
	}

	err := c.ShouldBind(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}

	err = h.repo.Repo.AddUser(ctx, user.UserName, user.Password, user.Email, user.Role)
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
		ID    uint
		Name  string
		Email string
		Role  string
	}

	err := c.ShouldBind(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}

	err = h.repo.Repo.UpdateUser(ctx, user.ID, user.Name, user.Email, user.Role)
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

// --------------------------------------------------------
func (h *Handler) AddIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var income struct {
		Amount      float64
		Description string
		Category    string
	}
	err := c.ShouldBind(&income)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}

	err = h.repo.Repo.AddIncome(ctx, income.Amount, income.Description, income.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkAddingIncome})
}

func (h *Handler) UpdateIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var income struct {
		ID          uint
		Amount      float64
		Description string
		Category    string
	}

	err := c.ShouldBind(&income)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrUpdatingIncome})
		return
	}

	err = h.repo.Repo.UpdateIncome(ctx, income.ID, income.Amount, income.Description, income.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkUpdatingIncome})
}

func (h *Handler) DeleteIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	IncID, _ := strconv.Atoi(c.Query("id"))
	err := h.repo.Repo.DeleteIncome(ctx, uint(IncID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrDeleteIncome})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkDeletingIncome})
}

func (h *Handler) Incomes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	incomes, err := h.repo.Repo.ListIncomes(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingIncomes})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: incomes})
}

// --------------------------------------------------------
func (h *Handler) AddExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var expense struct {
		Amount      float64
		Description string
		Category    string
	}
	err := c.ShouldBind(&expense)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	err = h.repo.Repo.AddExpense(ctx, expense.Amount, expense.Description, expense.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkAddingExpense})
}

func (h *Handler) UpdateExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var expense struct {
		ID          uint
		Amount      float64
		Description string
		Category    string
	}

	err := c.ShouldBind(&expense)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrUpdatingExpense})
		return
	}

	err = h.repo.Repo.UpdateExpense(ctx, expense.ID, expense.Amount, expense.Description, expense.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkUpdatingExpense})
}

func (h *Handler) DeleteExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	ExpInt, _ := strconv.Atoi(c.Query("id"))
	err := h.repo.Repo.DeleteExpense(ctx, uint(ExpInt))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrDeletingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkDeletingExpense})
}

func (h *Handler) Expenses(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	expenses, err := h.repo.Repo.ListExpenses(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingExpenses})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: expenses})
}
