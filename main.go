package main

import (
	"flag"
	"fmt"
	"full-stack-project/api"
	"full-stack-project/memory"
	"full-stack-project/pgsql"
	"full-stack-project/repo"
	"log"
	"strconv"
	"strings"

	"github.com/joho/godotenv"

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

// init function run before main function without need to be called
// here, we read configurations from config file and load environment variables
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

	initDB(h)

	router := gin.Default()
	router.Use(corsMiddleware())

	router.Static("/assets", "./dist/assets")
	router.StaticFile("/", "./dist/index.html")

	router.StaticFile("/incomes", "./dist/index.html")
	router.StaticFile("/expenses", "./dist/index.html")
	router.StaticFile("/users", "./dist/index.html")
	router.StaticFile("/report", "./dist/index.html")
	router.StaticFile("/login", "./dist/index.html")
	router.StaticFile("/logout", "./dist/index.html")
	router.StaticFile("/signup", "./dist/index.html")
	router.StaticFile("/back-login.avif", "./dist/back-login.avif")
	router.StaticFile("/back.png", "./dist/back.png")
	router.StaticFile("/money.ico", "./dist/money.ico")
	router.StaticFile("/userinfo", "./dist/index.html")

	router.POST("/api/v1/signup", h.Signup)
	router.POST("/api/v1/login", h.Login)
	router.GET("/api/v1/logout", api.CheckAuth, h.Logout)
	router.POST("/api/v1/change_password", api.CheckAuth, h.ChangePassword)
	router.GET("/api/v1/userinfo", api.CheckAuth, h.UserInfo)

	router.GET("/api/v1/users/list", api.CheckAuth, api.IsAdmin, h.ListUsers)
	router.POST("/api/v1/users/add", api.CheckAuth, api.IsAdmin, h.AddNewUser)
	router.POST("/api/v1/users/update", api.CheckAuth, api.IsAdmin, h.UpdateUser)
	router.DELETE("/api/v1/users/delete", api.CheckAuth, api.IsAdmin, h.DeleteUser)
	router.POST("/api/v1/users/change_password", api.CheckAuth, api.IsAdmin, h.ChangePasswordByAdmin)

	router.POST("/api/v1/incomes/add", api.CheckAuth, h.AddIncome)
	router.POST("/api/v1/incomes/update", api.CheckAuth, h.UpdateIncome)
	router.DELETE("/api/v1/incomes/delete", api.CheckAuth, h.DeleteIncome)
	router.GET("/api/v1/incomes/list", api.CheckAuth, h.Incomes)

	router.POST("/api/v1/expenses/add", api.CheckAuth, h.AddExpense)
	router.POST("/api/v1/expenses/update", api.CheckAuth, h.UpdateExpense)
	router.DELETE("/api/v1/expenses/delete", api.CheckAuth, h.DeleteExpense)
	router.GET("/api/v1/expenses/list", api.CheckAuth, h.Expenses)

	router.GET("/api/v1/incomes/report", api.CheckAuth, h.ReportIncomes)
	router.GET("/api/v1/expenses/report", api.CheckAuth, h.ReportExpenses)

	router.GET("/api/v1/incomes/export", api.CheckAuth, h.ExportIncomes)
	router.GET("/api/v1/expenses/export", api.CheckAuth, h.ExportExpenses)

	router.GET("/api/v1/incomes/summary", api.CheckAuth, h.IncomeSummary)
	router.GET("/api/v1/expenses/summary", api.CheckAuth, h.ExpenseSummary)

	router.GET("/api/v1/summary", api.CheckAuth, h.OverallSummary)

	// Start server
	strport := strconv.Itoa(options.Server.Port)
	err := router.RunTLS(":"+strport, options.Server.Tls_Cert_Path, options.Server.Tls_Key_Path)
	if err != nil {
		log.Printf("Error in starting http server: %s", err)
	}
}

// CORS middleware function definition
func corsMiddleware() gin.HandlerFunc {
	// Define allowed origins as a comma-separated string
	originsString := "http://localhost:5173,http://localhost:5174,http://localhost:3000,https://localhost:5173,https://localhost:3000"
	var allowedOrigins []string
	if originsString != "" {
		// Split the originsString into individual origins and store them in allowedOrigins slice
		allowedOrigins = strings.Split(originsString, ",")
	}

	// Return the actual middleware handler function
	return func(c *gin.Context) {
		// Function to check if a given origin is allowed
		isOriginAllowed := func(origin string, allowedOrigins []string) bool {
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					return true
				}
			}
			return false
		}

		// Get the Origin header from the request
		origin := c.Request.Header.Get("Origin")

		// Check if the origin is allowed
		if isOriginAllowed(origin, allowedOrigins) {
			// If the origin is allowed, set CORS headers in the response
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, DELETE")
		}

		// Handle preflight OPTIONS requests by aborting with status 204
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// Call the next handler
		c.Next()
	}
}
