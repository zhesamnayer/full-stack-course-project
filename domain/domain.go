package domain

type User struct {
	ID        uint   `gorm:"primary_key" json:"id"`
	CreatedAt uint64 `json:"created_at"`
	Username  string `json:"username" gorm:"unique"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	Role      string `json:"role"`
}

type Income struct {
	ID          uint    `gorm:"primary_key" json:"id"`
	CreatedAt   uint64  `json:"created_at"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
}

type Expense struct {
	ID          uint    `gorm:"primary_key" json:"id"`
	CreatedAt   uint64  `json:"created_at"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
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
