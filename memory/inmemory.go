package memory

import (
	"context"
	"errors"
	shared "full-stack-project/Shared"
	"full-stack-project/domain"
	"maps"
	"slices"
	"sync"
)

type MemoryRepo struct {
	users    map[uint]*domain.User
	expenses map[uint]*domain.Expense
	incomes  map[uint]*domain.Income
	roles    []string
	mu       *sync.Mutex
}

func NewMemoryRepo() (*MemoryRepo, error) {
	return &MemoryRepo{
		users:    make(map[uint]*domain.User),
		expenses: make(map[uint]*domain.Expense),
		incomes:  make(map[uint]*domain.Income),
		roles:    shared.Roles,
	}, nil
}

func SetDefaultRoles() error {

	return nil
}

func (r *MemoryRepo) ListUsers(ctx context.Context) (users []*domain.User, err error) {
	return slices.Collect(maps.Values(r.users)), nil
}

func (r *MemoryRepo) AddUser(ctx context.Context, name, password, email, role string) error {

	if !slices.Contains(r.roles, role) {
		return errors.New("cannot find the provided role")
	}

	user := domain.User{}

	user.ID = 1
	user.UserName = name
	user.Password = password
	user.Email = email
	user.RoleName = role

	r.users[user.ID] = &user
	return nil
}

func (r *MemoryRepo) UpdateUser(ctx context.Context, id uint, name, email, role string) error {
	if !slices.Contains(r.roles, role) {
		return errors.New("cannot find the provided role")
	}

	user := r.users[id]
	user.UserName = name
	user.Email = email
	// user.Role = role
	r.users[id] = user

	return nil
}

func (r *MemoryRepo) DeleteUser(ctx context.Context, id uint) error {
	delete(r.users, id)
	return nil
}

// ---------------------------------------------
func (r *MemoryRepo) ListIncomes(ctx context.Context) ([]*domain.Income, error) {
	return slices.Collect(maps.Values(r.incomes)), nil
}

func (r *MemoryRepo) AddIncome(ctx context.Context, amount float64, descrition, category string) error {
	income := domain.Income{}
	income.ID = 1
	income.Amount = amount
	income.Description = descrition
	income.Category = category

	r.incomes[income.ID] = &income
	return nil
}

func (r *MemoryRepo) UpdateIncome(ctx context.Context, id uint, amount float64, descrition, category string) error {
	r.incomes[id].Amount = amount
	r.incomes[id].Description = descrition
	r.incomes[id].Category = category
	return nil
}

func (r *MemoryRepo) DeleteIncome(ctx context.Context, id uint) error {
	delete(r.incomes, id)
	return nil
}

func (r *MemoryRepo) ListExpenses(ctx context.Context) ([]*domain.Expense, error) {
	return slices.Collect(maps.Values(r.expenses)), nil
}

func (r *MemoryRepo) AddExpense(ctx context.Context, amount float64, descrition, category string) error {
	expense := domain.Expense{}

	expense.ID = 1
	expense.Amount = amount
	expense.Description = descrition
	expense.Category = category

	r.expenses[expense.ID] = &expense
	return nil
}

func (r *MemoryRepo) UpdateExpense(ctx context.Context, id uint, amount float64, descrition, category string) error {
	r.expenses[id].Amount = amount
	r.expenses[id].Description = descrition
	r.expenses[id].Category = category
	return nil
}

func (r *MemoryRepo) DeleteExpense(ctx context.Context, id uint) error {
	delete(r.expenses, id)
	return nil
}

func (r *MemoryRepo) CheckUserCredentials(ctx context.Context, username, password string) error {
	return nil
}
