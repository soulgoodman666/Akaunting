package routes

import (
	"net/http"

	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Akaunting Backend API is running",
			"status":  "ok",
		})
	})

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login(db))
			auth.POST("/register", handlers.Register(db))
		}

		protected := v1.Group("/")
		protected.Use(handlers.AuthMiddleware())
		{
			users := protected.Group("/users")
			{
				users.GET("", handlers.GetUsers(db))
				users.GET("/:id", handlers.GetUser(db))
				users.POST("", handlers.CreateUser(db))
				users.PUT("/:id", handlers.UpdateUser(db))
				users.DELETE("/:id", handlers.DeleteUser(db))
			}

			companies := protected.Group("/companies")
			{
				companies.GET("", handlers.GetCompanies(db))
				companies.POST("", handlers.CreateCompany(db))
				companies.GET("/:id", handlers.GetCompany(db))
				companies.PUT("/:id", handlers.UpdateCompany(db))
				companies.DELETE("/:id", handlers.DeleteCompany(db))
			}
		}
	}
}
