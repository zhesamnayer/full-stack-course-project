package pgsql

import (
	"context"
	"full-stack-project/domain"
)

func (r *PqsqlRepo) ListExpenses(ctx context.Context, userID uint) ([]*domain.Expense, error) {
	var expense []*domain.Expense
	err := r.conn.WithContext(ctx).Where("user_id = ?", userID).Find(&expense).Error
	if err != nil {
		return nil, err
	}
	return expense, nil
}

func (r *PqsqlRepo) AddExpense(ctx context.Context, amount float64, description, category string, userID uint) error {
	expense := &domain.Expense{
		Amount:      amount,
		Description: description,
		Category:    category,
		UserID:      userID,
	}

	err := r.conn.WithContext(ctx).Create(expense).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) UpdateExpense(ctx context.Context, id uint, amount float64, description, category string, userID uint) error {

	result := r.conn.WithContext(ctx).
		Model(&domain.Expense{}).
		Where("ID = ? and user_id = ?", id, userID).
		Updates(domain.Expense{
			Amount:      amount,
			Description: description,
			Category:    category,
		})

	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *PqsqlRepo) DeleteExpense(ctx context.Context, id uint, userID uint) error {
	err := r.conn.WithContext(ctx).Delete(domain.Expense{}, "ID  = ? and user_id = ?", id, userID).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) ReportExpenses(ctx context.Context, from, to string, userID uint) ([]*domain.Expense, error) {
	var expenses []*domain.Expense

	err := r.conn.WithContext(ctx).Model(domain.Expense{}).Where("created_at >= ? and created_at <= ? and user_id = ?", from, to, userID).Find(&expenses).Error
	if err != nil {
		return nil, err
	}

	return expenses, nil
}

func (r *PqsqlRepo) ExpensesSummary(ctx context.Context, userID uint) ([]*domain.ExpenseSummary, error) {
	var summary []*domain.ExpenseSummary

	err := r.conn.WithContext(ctx).Model(domain.Expense{}).
		Where("user_id = ?", userID).
		Select("category, sum(amount) as amount").
		Group("category").
		Scan(&summary).Error
	if err != nil {
		return nil, err
	}

	return summary, nil
}
