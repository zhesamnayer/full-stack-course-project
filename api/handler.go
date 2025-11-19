package api

import (
	"full-stack-project/repo"
	"reflect"
	"time"
)

const TokenLifeTime = time.Minute * 60

// CommonTypeWithStringTime is a common type used for both incomes and expenses in which field of time is in string format
type CommonTypeWithStringTime struct {
	ID          uint    `gorm:"primary_key"`
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
