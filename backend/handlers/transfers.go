package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetTransfers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var transfers []models.TransferOrder
		
		if db == nil {
			transfers = []models.TransferOrder{
				{ID: 1, Kode: "TR001", ItemID: 1, FromWarehouseID: 1, ToWarehouseID: 2, Jumlah: 10, Status: "pending", TanggalTransfer: "2024-01-15", Catatan: "Transfer untuk maintenance"},
				{ID: 2, Kode: "TR002", ItemID: 2, FromWarehouseID: 2, ToWarehouseID: 1, Jumlah: 5, Status: "completed", TanggalTransfer: "2024-01-10", Catatan: "Stok darurat"},
			}
			c.JSON(http.StatusOK, transfers)
			return
		}
		
		if err := db.Preload("Item").Preload("FromWarehouse").Preload("ToWarehouse").Find(&transfers).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, transfers)
	}
}

func CreateTransfer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var transfer models.TransferOrder
		if err := c.ShouldBindJSON(&transfer); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message":  "Transfer created successfully (in memory)",
				"transfer": transfer,
			})
			return
		}
		
		if err := db.Create(&transfer).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusCreated, transfer)
	}
}

func UpdateTransfer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		var transfer models.TransferOrder
		if err := c.ShouldBindJSON(&transfer); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message":  "Transfer updated successfully (in memory)",
				"transfer": transfer,
			})
			return
		}
		
		if err := db.Model(&models.TransferOrder{}).Where("id = ?", id).Updates(transfer).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		transfer.ID = uint(id)
		c.JSON(http.StatusOK, transfer)
	}
}

func DeleteTransfer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Transfer deleted successfully (in memory)",
			})
			return
		}
		
		if err := db.Delete(&models.TransferOrder{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Transfer deleted successfully"})
	}
}

func ApproveTransfer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Transfer approved successfully (in memory)",
			})
			return
		}
		
		if err := db.Model(&models.TransferOrder{}).Where("id = ?", id).Update("status", "approved").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Transfer approved successfully"})
	}
}

func CompleteTransfer(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Transfer completed successfully (in memory)",
			})
			return
		}
		
		if err := db.Model(&models.TransferOrder{}).Where("id = ?", id).Update("status", "completed").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Transfer completed successfully"})
	}
}
