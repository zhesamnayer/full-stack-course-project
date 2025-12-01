package pgsql

import (
	"context"
	"full-stack-project/domain"
)

func (r *PqsqlRepo) OverallSummary(ctx context.Context, from, to string) ([]*domain.IncomeSummary, error) {

	var sumIncomes float64

	err := r.conn.Model(domain.Income{}).
		Select("SUM(amount)").
		Where("created_at >= ? AND created_at <=?", from, to).Scan(&sumIncomes).Error

	if err != nil {
		return nil, err
	}

	var sumExpenses float64

	err = r.conn.Model(domain.Expense{}).
		Select("SUM(amount)").
		Where("created_at >= ? AND created_at <=?", from, to).Scan(&sumExpenses).Error

	if err != nil {
		return nil, err
	}

	var fs []*domain.IncomeSummary

	f := &domain.IncomeSummary{
		Category: "Income",
		Amount:   sumIncomes,
	}

	fs = append(fs, f)
	f = &domain.IncomeSummary{
		Category: "Expense",
		Amount:   sumExpenses,
	}

	fs = append(fs, f)

	return fs, nil
}
