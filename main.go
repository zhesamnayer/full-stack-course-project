package main

import (
	"flag"
	"fmt"
	"full-stack-project/api"
	"full-stack-project/memory"
	"full-stack-project/pgsql"
	"full-stack-project/repo"
	"github.com/joho/godotenv"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	EnvFilePath = "infra/.env"
	DefaultDB   = "postgres"
)

var (
	repoFlag string
	options  *Config
)

func init() {
	flag.StringVar(&repoFlag, "d", DefaultDB, "Which db?")
	flag.Parse()
	options = GetOptions()

	err := godotenv.Load(EnvFilePath)
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	var dbrepo *repo.DBRepository

	if repoFlag == "mem" {
		memrepo, err := memory.NewMemoryRepo()
		if err != nil {
			log.Fatalf("Error in connecting to memrepo: %s", err)
		}

		dbrepo = repo.NewDBResository(memrepo)
	} else {
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=Europe/Helsinki",
			options.Server.Host,
			options.Database.User,
			options.Database.Password,
			options.Database.Name,
			options.Database.Port,
			options.Database.SSLMode,
		)

		pgsqlRepo, err := pgsql.NewPgsqlRepo(dsn)
		if err != nil {
			log.Fatalf("Error in connecting to postgres: %s", err)
		}

		dbrepo = repo.NewDBResository(pgsqlRepo)
	}

	h := api.NewHandler(dbrepo)

	router := gin.Default()

	router.POST("/api/v1/login", h.Login)
	router.GET("/api/v1/logout", h.Logout)

	router.GET("/api/v1/users/list", h.ListUsers)
	router.POST("/api/v1/users/add", h.AddUser)
	router.POST("/api/v1/users/update", h.UpdateUser)
	router.DELETE("/api/v1/users/delete", h.DeleteUser)

	router.POST("/api/v1/incomes/add", h.AddIncome)
	router.POST("/api/v1/incomes/update", h.UpdateIncome)
	router.DELETE("/api/v1/incomes/delete", h.DeleteIncome)
	router.GET("/api/v1/incomes/list", h.Incomes)

	router.POST("/api/v1/expenses/add", h.AddExpense)
	router.POST("/api/v1/expenses/update", h.UpdateExpense)
	router.DELETE("/api/v1/expenses/delete", h.DeleteExpense)
	router.GET("/api/v1/expenses/list", h.Expenses)

	router.GET("/api/v1/incomes/report", h.ReportIncomes)
	router.GET("/api/v1/expenses/report", h.ReportExpenses)

	router.GET("/api/v1/incomes/export", h.ExportIncomes)
	router.GET("/api/v1/expenses/export", h.ExportExpenses)

	// Start server
	strport := strconv.Itoa(options.Server.Port)
	router.Run(":" + strport)
}
