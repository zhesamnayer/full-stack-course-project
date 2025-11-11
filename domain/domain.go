package domain

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model

	UserName string `json:"user_name" gorm:"unique"`
	RoleName string `json:"role_name"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Income struct {
	gorm.Model

	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
}

type Expense struct {
	gorm.Model

	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
}
