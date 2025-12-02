package domain

type User struct {
	ID        uint   `gorm:"primary_key" json:"id"`
	CreatedAt uint64 `json:"created_at"`
	Username  string `json:"username" gorm:"unique"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	Role      string `json:"role"`

	// Relation: one user has many incomes
	Incomes  []Income  `gorm:"constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"incomes"`
	Expenses []Expense `gorm:"constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"expenses"`
}

type Income struct {
	ID          uint    `gorm:"primary_key" json:"id"`
	CreatedAt   uint64  `json:"created_at"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`

	// Foreign key to User
	UserID uint `json:"user_id"`
}

type Expense struct {
	ID          uint    `gorm:"primary_key" json:"id"`
	CreatedAt   uint64  `json:"created_at"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`

	// Foreign key to User
	UserID uint `json:"user_id"`
}

type IncomeSummary struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
}

type ExpenseSummary struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
}

type FinancialSummary struct {
	Incomes float64
	Expense float64
}
