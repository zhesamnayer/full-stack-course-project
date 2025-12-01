package repo

import (
	"context"
	"full-stack-project/domain"
)

type DBRepository struct {
	Repo Repository
}

func NewDBResository(repo Repository) *DBRepository {
	return &DBRepository{
		Repo: repo,
	}
}

type Repository interface {
	CheckUserCredentials(ctx context.Context, username, password string) error
	ListUsers(ctx context.Context) ([]*domain.User, error)
	AddUser(ctx context.Context, username, password, email, role string) error
	UpdateUser(ctx context.Context, id uint, name, email, role string) error
	DeleteUser(ctx context.Context, id uint) error
	GetUserInfo(ctx context.Context, username string) (*domain.User, error)

	ListIncomes(ctx context.Context) ([]*domain.Income, error)
	AddIncome(ctx context.Context, amount float64, descrition, category string) error
	UpdateIncome(ctx context.Context, id uint, amount float64, descrition, category string) error
	DeleteIncome(ctx context.Context, id uint) error
	ReportIncomes(ctx context.Context, from, to string) ([]*domain.Income, error)

	ListExpenses(ctx context.Context) ([]*domain.Expense, error)
	AddExpense(ctx context.Context, amount float64, descrition, category string) error
	UpdateExpense(ctx context.Context, id uint, amount float64, descrition, category string) error
	DeleteExpense(ctx context.Context, id uint) error
	ReportExpenses(ctx context.Context, from, to string) ([]*domain.Expense, error)

	IncomesSummary(ctx context.Context) ([]*domain.IncomeSummary, error)
	ExpensesSummary(ctx context.Context) ([]*domain.ExpenseSummary, error)

	OverallSummary(ctx context.Context, from, to string) ([]*domain.IncomeSummary, error)
}
