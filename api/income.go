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

func (h *Handler) AddIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var income struct {
		Amount      float64
		Description string
		Category    string
	}
	err := c.ShouldBind(&income)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}

	err = h.repo.Repo.AddIncome(ctx, income.Amount, income.Description, income.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkAddingIncome})
}

func (h *Handler) UpdateIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	var income struct {
		ID          uint
		Amount      float64
		Description string
		Category    string
	}

	err := c.ShouldBind(&income)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrUpdatingIncome})
		return
	}

	err = h.repo.Repo.UpdateIncome(ctx, income.ID, income.Amount, income.Description, income.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrAddingIncome})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkUpdatingIncome})
}

func (h *Handler) DeleteIncome(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	IncID, _ := strconv.Atoi(c.Query("id"))
	err := h.repo.Repo.DeleteIncome(ctx, uint(IncID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{shared.ErrKeyword: shared.ErrDeleteIncome})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: shared.OkDeletingIncome})
}

func (h *Handler) Incomes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 100*time.Millisecond)
	defer cancel()

	incomes, err := h.repo.Repo.ListIncomes(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingIncomes})
		return
	}

	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: incomes})
}

func (h *Handler) ReportIncomes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 500*time.Millisecond)
	defer cancel()

	from := c.Query("from")
	to := c.Query("to")

	incomes, err := h.repo.Repo.ReportIncomes(ctx, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, shared.ErrListingIncomes)
		return
	}

	var newIncomes []CommonTypeWithStringTime

	for i, _ := range incomes {
		ni := CommonTypeWithStringTime{
			ID:          incomes[i].ID,
			Amount:      incomes[i].Amount,
			CreatedAt:   shared.UnixTimeToRFC339(incomes[i].CreatedAt),
			Description: incomes[i].Description,
			Category:    incomes[i].Category,
		}

		newIncomes = append(newIncomes, ni)
	}

	c.JSON(http.StatusOK, newIncomes)
}

func (h *Handler) ExportIncomes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 5*time.Second)
	defer cancel()

	from := c.Query("from")
	to := c.Query("to")

	incomes, err := h.repo.Repo.ReportIncomes(ctx, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrListingIncomes})
		return
	}

	var newIncomes []CommonTypeWithStringTime

	for i, _ := range incomes {
		ni := CommonTypeWithStringTime{
			ID:          incomes[i].ID,
			Amount:      incomes[i].Amount,
			CreatedAt:   shared.UnixTimeToRFC339(incomes[i].CreatedAt),
			Description: incomes[i].Description,
			Category:    incomes[i].Category,
		}

		newIncomes = append(newIncomes, ni)
	}

	// Create an in-memory buffer for the CSV
	buf := new(bytes.Buffer)
	writer := csv.NewWriter(buf)

	// Write header
	writer.Write(GetFieldNames(domain.Income{}))

	// Write data
	for _, i := range newIncomes {
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
	c.Header("Content-Disposition", "attachment; filename=incomes.csv")
	c.Data(http.StatusOK, "text/csv", buf.Bytes())
}

func (h *Handler) IncomeSummary(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c, 5*time.Second)
	defer cancel()

	res, err := h.repo.Repo.IncomesSummary(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{shared.ErrKeyword: shared.ErrInternalError})
		return
	}
	c.JSON(http.StatusOK, gin.H{shared.OkKeyword: res})
}
