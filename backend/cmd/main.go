package main

import (
	"log"
	"os"

	"backend/config"
	"backend/models"
	"backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	db, err := config.InitDB()
	if err != nil {
		log.Println("Failed to connect to database:", err)
		log.Println("Starting server without database connection...")
		db = nil
	} else {
		// Auto migrate tables (preserve data)
		log.Println("Running database migrations...")
		if err := db.AutoMigrate(
			&models.User{},
			&models.Company{},
			&models.Account{},
			&models.Category{},
			&models.Transaction{},
			&models.Item{},
			&models.Group{},
			&models.GroupItem{},
			&models.Warehouse{},
			&models.TransferOrder{},
		); err != nil {
			log.Println("Migration failed:", err)
		} else {
			log.Println("Database migrations completed successfully!")

			// Check if data exists
			var itemCount int64
			if err := db.Table("items").Count(&itemCount).Error; err == nil {
				log.Printf("Found %d items in database", itemCount)
			}

			var warehouseCount int64
			if err := db.Table("warehouses").Count(&warehouseCount).Error; err == nil {
				log.Printf("Found %d warehouses in database", warehouseCount)
			}
		}
	}

	// Initialize Gin router
	r := gin.Default()

	// Setup CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://127.0.0.1:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Setup routes
	routes.SetupRoutes(r, db)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
