package routes

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupHistoryRoutes(db *gorm.DB) *gin.Engine {
	historyService := services.NewHistoryService(db)

	router := gin.Default()

	// GET /api/v1/history - Get all history
	router.GET("/api/v1/history", func(c *gin.Context) {
		histories, err := historyService.GetAllHistory()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, histories)
	})

	// GET /api/v1/history/:id - Get history by ID
	router.GET("/api/v1/history/:id", func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		histories, err := historyService.GetAllHistory()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Find specific history
		for _, history := range histories {
			if history.ID == uint(id) {
				c.JSON(http.StatusOK, history)
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{"error": "History not found"})
	})

	// DELETE /api/v1/history/:id - Delete history by ID
	router.DELETE("/api/v1/history/:id", func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		deleteErr := db.Delete(&models.Transaction{}, uint(id)).Error
		if deleteErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": deleteErr.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "History deleted successfully"})
	})

	// POST /api/v1/history/item - Create history for item action
	router.POST("/api/v1/history/item", func(c *gin.Context) {
		var req struct {
			ItemID uint   `json:"item_id" binding:"required"`
			Action string `json:"action" binding:"required"` // "add", "update", "reduce"
			UserID uint   `json:"user_id"`
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

		// Create history based on action
		var historyErr error
		switch req.Action {
		case "add", "update":
			historyErr = historyService.CreateItemHistory(&item, req.Action, req.UserID)
		case "reduce":
			var reductionReq struct {
				ReductionAmount int    `json:"reduction_amount"`
				Reason          string `json:"reason"`
			}
			if bindErr := c.ShouldBindJSON(&reductionReq); bindErr != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": bindErr.Error()})
				return
			}
			historyErr = historyService.CreateStockReductionHistory(&item, reductionReq.ReductionAmount, reductionReq.Reason, req.UserID)
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
			return
		}

		if historyErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": historyErr.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "History created successfully"})
	})

	// POST /api/v1/history/transfer - Create history for transfer action
	router.POST("/api/v1/history/transfer", func(c *gin.Context) {
		var req struct {
			TransferID uint   `json:"transfer_id" binding:"required"`
			Action     string `json:"action" binding:"required"` // "create", "update", "status_change"
			UserID     uint   `json:"user_id"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Get transfer details
		var transfer models.TransferOrder
		if err := db.First(&transfer, req.TransferID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transfer not found"})
			return
		}

		err := historyService.CreateTransferHistory(&transfer, req.Action, req.UserID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Transfer history created successfully"})
	})

	return router
}
