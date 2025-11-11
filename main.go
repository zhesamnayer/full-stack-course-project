package main

import (
	"flag"
	"full-stack-project/api"
	"full-stack-project/memory"
	"full-stack-project/pgsql"
	"full-stack-project/repo"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
)

var (
	repoFlag string
	options  *Config
)

func init() {
	flag.StringVar(&repoFlag, "d", "mem", "Which db?")
	flag.Parse()
	options = GetOptions()
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
		dsn := "host=" + options.Server.Host + " " +
			"user=" + options.Database.User + " " +
			"password=" + options.Database.Password + " " +
			"dbname=" + options.Database.Name + " " +
			"port=" + strconv.Itoa(options.Database.Port) + " " +
			"sslmode=" + options.Database.SSLMode + " TimeZone=Europe/Helsinki"
		// log.Println(dsn)
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

	// router.GET("/api/v1/incomes/report", h.ReportIncome)
	// router.GET("/api/v1/expense/report", h.ReportExpense)
	// router.GET("/api/v1/incomes/export", h.ExportIncome)
	// router.GET("/api/v1/expense/export", h.ExportExpense)

	// Start server
	strport := strconv.Itoa(options.Server.Port)
	router.Run(":" + strport)
}
