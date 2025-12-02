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
	ChangePassword(ctx context.Context, userID uint, password string) error
	AddAdminUser() error

	ListIncomes(ctx context.Context, userID uint) ([]*domain.Income, error)
	AddIncome(ctx context.Context, amount float64, descrition, category string, userID uint) error
	UpdateIncome(ctx context.Context, id uint, amount float64, descrition, category string, userID uint) error
	DeleteIncome(ctx context.Context, id uint, userID uint) error
	ReportIncomes(ctx context.Context, from, to string, userID uint) ([]*domain.Income, error)

	ListExpenses(ctx context.Context, userID uint) ([]*domain.Expense, error)
	AddExpense(ctx context.Context, amount float64, descrition, category string, userID uint) error
	UpdateExpense(ctx context.Context, id uint, amount float64, descrition, category string, userID uint) error
	DeleteExpense(ctx context.Context, id uint, userID uint) error
	ReportExpenses(ctx context.Context, from, to string, userID uint) ([]*domain.Expense, error)

	IncomesSummary(ctx context.Context, userID uint) ([]*domain.IncomeSummary, error)
	ExpensesSummary(ctx context.Context, userID uint) ([]*domain.ExpenseSummary, error)

	OverallSummary(ctx context.Context, from, to string, userID uint) ([]*domain.IncomeSummary, error)
}
