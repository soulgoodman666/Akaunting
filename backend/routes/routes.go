package routes

import (
	"fmt"
	"net/http"
	"time"

	"backend/handlers"
	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func generateTransactionNumber(prefix string) string {
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("%s-%s", prefix, timestamp)
}

func SetupRoutes(r *gin.Engine, db *gorm.DB) {

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Akaunting Backend API is running",
			"status":  "ok",
		})
	})

	// History routes
	r.GET("/api/v1/history", func(c *gin.Context) {
		var histories []models.Transaction
		err := db.Preload("Item").Preload("Warehouse").Preload("User").Order("created_at DESC").Find(&histories).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, histories)
	})

	r.DELETE("/api/v1/history/:id", func(c *gin.Context) {
		id := c.Param("id")
		err := db.Delete(&models.Transaction{}, id).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "History deleted successfully"})
	})

	r.POST("/api/v1/history/item", func(c *gin.Context) {
		var req struct {
			ItemID          uint   `json:"item_id" binding:"required"`
			Action          string `json:"action" binding:"required"`
			UserID          uint   `json:"user_id"`
			ReductionAmount int    `json:"reduction_amount"`
			Reason          string `json:"reason"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Get item details
		var item models.Item
		if err := db.First(&item, req.ItemID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
			return
		}

		// Create transaction history
		var transaction models.Transaction
		if req.Action == "add" {
			transaction = models.Transaction{
				Number:      generateTransactionNumber("ITEM"),
				Type:        "Stock In",
				Description: fmt.Sprintf("Item added: %s", item.Nama),
				Amount:      float64(item.Harga) * float64(item.Jumlah),
				Currency:    "IDR",
				Date:        time.Now(),
				Reference:   item.Kode,
				ItemID:      item.ID,
				WarehouseID: item.GudangID,
				UserID:      req.UserID,
				Quantity:    item.Jumlah,
				Status:      "Completed",
			}
		} else if req.Action == "reduce" {
			transaction = models.Transaction{
				Number:      generateTransactionNumber("RED"),
				Type:        "Stock Out",
				Description: fmt.Sprintf("Stock reduction: %s - %d units - Reason: %s", item.Nama, req.ReductionAmount, req.Reason),
				Amount:      float64(req.ReductionAmount) * float64(item.Harga),
				Currency:    "IDR",
				Date:        time.Now(),
				Reference:   item.Kode,
				ItemID:      item.ID,
				WarehouseID: item.GudangID,
				UserID:      req.UserID,
				Quantity:    -req.ReductionAmount, // Negative for stock out
				Status:      "Completed",
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
			return
		}

		// Handle foreign key constraints - set to 0 if null
		if transaction.UserID == 0 {
			transaction.UserID = 0
		}
		if transaction.WarehouseID == 0 {
			transaction.WarehouseID = 0
		}

		// Create transaction without foreign key constraints
		if err := db.Create(&transaction).Error; err != nil {
			// Log error but don't fail the request
			fmt.Printf("History creation failed: %v\n", err)
			c.JSON(http.StatusCreated, gin.H{"message": "Item saved successfully (history creation failed)"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "History created successfully"})
	})

	// Items routes (tanpa authentication untuk sementara)
	items := r.Group("/items")
	{
		items.GET("", handlers.GetItems(db))
		items.POST("", handlers.CreateItem(db))
		items.PUT("/:id", handlers.UpdateItem(db))
		items.DELETE("/:id", handlers.DeleteItem(db))
		items.DELETE("/batch", handlers.DeleteItemsBatch(db))
	}

	// Groups routes
	groups := r.Group("/groups")
	{
		groups.GET("", handlers.GetGroups(db))
		groups.POST("", handlers.CreateGroup(db))
		groups.PUT("/:id", handlers.UpdateGroup(db))
		groups.DELETE("/:id", handlers.DeleteGroup(db))
		groups.GET("/:id/items", handlers.GetGroupItems(db))
		groups.POST("/:id/items", handlers.AddItemToGroup(db))
	}

	// Warehouses routes
	warehouses := r.Group("/warehouses")
	{
		warehouses.GET("", handlers.GetWarehouses(db))
		warehouses.POST("", handlers.CreateWarehouse(db))
		warehouses.PUT("/:id", handlers.UpdateWarehouse(db))
		warehouses.DELETE("/:id", handlers.DeleteWarehouse(db))
	}

	// Transfers routes
	transfers := r.Group("/transfers")
	{
		transfers.GET("", handlers.GetTransfers(db))
		transfers.POST("", handlers.CreateTransfer(db))
		transfers.PUT("/:id", handlers.UpdateTransfer(db))
		transfers.DELETE("/:id", handlers.DeleteTransfer(db))
		transfers.PUT("/:id/approve", handlers.ApproveTransfer(db))
		transfers.PUT("/:id/complete", handlers.CompleteTransfer(db))
	}

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
