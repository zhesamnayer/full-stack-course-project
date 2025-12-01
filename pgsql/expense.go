package pgsql

import (
	"context"
	"full-stack-project/domain"
)

func (r *PqsqlRepo) ListExpenses(ctx context.Context) ([]*domain.Expense, error) {
	var expense []*domain.Expense
	err := r.conn.Find(&expense).Error
	if err != nil {
		return nil, err
	}
	return expense, nil
}

func (r *PqsqlRepo) AddExpense(ctx context.Context, amount float64, description, category string) error {
	expense := &domain.Expense{
		Amount:      amount,
		Description: description,
		Category:    category,
	}

	err := r.conn.Create(expense).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) UpdateExpense(ctx context.Context, id uint, amount float64, descrition, category string) error {
	// Finding the expense
	var expense domain.Expense
	r.conn.Find(&expense).Where("ID = ?", id)

	// Update the expense information
	expense.ID = id
	expense.Amount = amount
	expense.Description = descrition
	expense.Category = category

	// Save the expense
	err := r.conn.Save(&expense).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) DeleteExpense(ctx context.Context, id uint) error {
	err := r.conn.Delete(domain.Expense{}, "ID  = ?", id).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) ReportExpenses(ctx context.Context, from, to string) ([]*domain.Expense, error) {
	var expenses []*domain.Expense

	err := r.conn.Model(domain.Expense{}).Where("created_at >= ? and created_at <= ?", from, to).Find(&expenses).Error
	if err != nil {
		return nil, err
	}

	return expenses, nil
}

func (r *PqsqlRepo) ExpensesSummary(ctx context.Context) ([]*domain.ExpenseSummary, error) {
	var summary []*domain.ExpenseSummary

	err := r.conn.Model(domain.Expense{}).
		Select("category, sum(amount) as amount").
		Group("category").
		Scan(&summary).Error
	if err != nil {
		return nil, err
	}

	return summary, nil
}
