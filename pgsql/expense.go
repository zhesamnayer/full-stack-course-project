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
	expense.Amount = amount
	expense.Description = descrition
	expense.Category = category

	// Save the expense
	err := r.conn.Save(&expense).Error
	if err != nil {
		return err
	}

	// -------------
	// err := r.conn.Model(domain.Expense{}).
	// 	Where("id = ?", id).
	// 	Update("amount", amount).
	// 	Update("description", descrition).
	// 	Update("category", category).Error
	// if err != nil {
	// 	return err
	// }

	//----------------

	return nil
}

func (r *PqsqlRepo) DeleteExpense(ctx context.Context, id uint) error {
	err := r.conn.Delete(domain.Expense{}).Where("ID  = ?", id).Error
	if err != nil {
		return err
	}
	return nil
}
