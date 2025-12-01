package api

import (
	"context"
	shared "full-stack-project/Shared"
	"full-stack-project/repo"
	"github.com/gin-gonic/gin"
	"net/http"
	"reflect"
	"time"
)

const TokenLifeTime = time.Minute * 60

// CommonTypeWithStringTime is a common type used for both incomes and expenses in which field of time is in string format
type CommonTypeWithStringTime struct {
	ID          uint    `gorm:"primary_key" json:"id"`
	CreatedAt   string  `json:"created_at"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
}

type Handler struct {
	repo *repo.DBRepository
}

func NewHandler(repo *repo.DBRepository) *Handler {
	return &Handler{
		repo: repo,
	}
}

func (h *Handler) OverallSummary(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 5*time.Second)
	defer cancel()

	from := c.Query("from")
	to := c.Query("to")

	if from == "" || to == "" {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrBadRequest})
		return
	}

	res, err := h.repo.Repo.OverallSummary(ctx, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrInternalError})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: res})
}

//func TimeConversion(c *gin.Context) (time.Time, time.Time, error) {
//	fromStr := c.Query("from")
//	toStr := c.Query("to")
//
//	fromInt, err1 := strconv.ParseInt(fromStr, 10, 64)
//	toInt, err2 := strconv.ParseInt(toStr, 10, 64)
//
//	if err1 != nil || err2 != nil {
//		return time.Time{}, time.Time{}, errors.New(shared.ErrBadRequest)
//	}
//
//	from := time.Unix(fromInt, 0)
//	to := time.Unix(toInt, 0)
//
//	return from, to, nil
//}

func GetFieldNames(v interface{}) []string {
	t := reflect.TypeOf(v)

	// if pointer, get the element type
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	// must be a struct
	if t.Kind() != reflect.Struct {
		return nil
	}

	fields := make([]string, 0, t.NumField())
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		fields = append(fields, field.Name)
	}

	return fields
}
