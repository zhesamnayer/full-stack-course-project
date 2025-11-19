package pgsql

import (
	"context"
	"full-stack-project/domain"
)

func (r *PqsqlRepo) ListIncomes(ctx context.Context) ([]*domain.Income, error) {
	var incomes []*domain.Income
	err := r.conn.Find(&incomes).Error
	if err != nil {
		return nil, err
	}
	return incomes, nil
}

func (r *PqsqlRepo) AddIncome(ctx context.Context, amount float64, descrition, category string) error {
	income := &domain.Income{
		Amount:      amount,
		Description: descrition,
		Category:    category,
	}

	err := r.conn.Create(income).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) UpdateIncome(ctx context.Context, id uint, amount float64, description, category string) error {
	// Finding the income
	var income domain.Income
	r.conn.Find(&income).Where("ID = ", id)

	// Update the income information
	income.Amount = amount
	income.Description = description
	income.Category = category

	// Save the income
	err := r.conn.Save(&income).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *PqsqlRepo) DeleteIncome(ctx context.Context, id uint) error {
	err := r.conn.Delete(domain.Income{}, "ID  = ?", id).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) ReportIncomes(ctx context.Context, from, to string) ([]*domain.Income, error) {
	var incomes []*domain.Income

	err := r.conn.Model(domain.Income{}).Where("created_at >= ? and created_at <= ?", from, to).Find(&incomes).Error
	if err != nil {
		return nil, err
	}

	return incomes, nil
}
