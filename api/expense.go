package api

import (
	"bytes"
	"context"
	"encoding/csv"
	"fmt"
	shared "full-stack-project/Shared"
	"full-stack-project/domain"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

func (h *Handler) AddExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var expense struct {
		Amount      float64
		Description string
		Category    string
	}
	err := c.ShouldBind(&expense)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	err = h.repo.Repo.AddExpense(ctx, expense.Amount, expense.Description, expense.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkAddingExpense})
}

func (h *Handler) UpdateExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var expense struct {
		ID          uint
		Amount      float64
		Description string
		Category    string
	}

	err := c.ShouldBind(&expense)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrUpdatingExpense})
		return
	}

	err = h.repo.Repo.UpdateExpense(ctx, expense.ID, expense.Amount, expense.Description, expense.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkUpdatingExpense})
}

func (h *Handler) DeleteExpense(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	ExpInt, _ := strconv.Atoi(c.Query("id"))
	err := h.repo.Repo.DeleteExpense(ctx, uint(ExpInt))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrDeletingExpense})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkDeletingExpense})
}

func (h *Handler) Expenses(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	expenses, err := h.repo.Repo.ListExpenses(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingExpenses})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: expenses})
}

func (h *Handler) ReportExpenses(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	from := c.Query("from")
	to := c.Query("to")

	expenses, err := h.repo.Repo.ReportExpenses(ctx, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, shared.ErrListingExpenses)
		return
	}

	var newExpenses []CommonTypeWithStringTime

	for i, _ := range expenses {
		ni := CommonTypeWithStringTime{
			ID:          expenses[i].ID,
			Amount:      expenses[i].Amount,
			CreatedAt:   shared.UnixTimeToRFC339(expenses[i].CreatedAt),
			Description: expenses[i].Description,
			Category:    expenses[i].Category,
		}

		newExpenses = append(newExpenses, ni)
	}

	c.JSON(http.StatusOK, newExpenses)
}

func (h *Handler) ExportExpenses(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	from := c.Query("from")
	to := c.Query("to")

	expenses, err := h.repo.Repo.ReportExpenses(ctx, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingIncomes})
		return
	}

	var newExpenses []CommonTypeWithStringTime

	for i, _ := range expenses {
		ni := CommonTypeWithStringTime{
			ID:          expenses[i].ID,
			Amount:      expenses[i].Amount,
			CreatedAt:   shared.UnixTimeToRFC339(expenses[i].CreatedAt),
			Description: expenses[i].Description,
			Category:    expenses[i].Category,
		}

		newExpenses = append(newExpenses, ni)
	}

	// Create an in-memory buffer for the CSV
	buf := new(bytes.Buffer)
	writer := csv.NewWriter(buf)

	// Write header
	writer.Write(GetFieldNames(domain.Income{}))

	// Write data
	for _, i := range newExpenses {
		record := []string{
			fmt.Sprintf("%d", i.ID),
			fmt.Sprintf("%d", i.CreatedAt),
			strconv.FormatFloat(i.Amount, 'f', 2, 64),
			i.Description,
			i.Category,
		}
		writer.Write(record)
	}
	writer.Flush()

	// Set headers so browser downloads file
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=expenses.csv")
	c.Data(http.StatusOK, "text/csv", buf.Bytes())
}

func (h *Handler) ExpenseSummary(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 5*time.Second)
	defer cancel()

	res, err := h.repo.Repo.ExpensesSummary(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrInternalError})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: res})
}
