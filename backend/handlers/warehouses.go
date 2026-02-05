package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetWarehouses(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var warehouses []models.Warehouse
		
		if db == nil {
			warehouses = []models.Warehouse{
				{ID: 1, Nama: "Gudang A", Kode: "WH001", Alamat: "Jl. Industri No. 1", Kota: "Jakarta", Provinsi: "DKI Jakarta", Kapasitas: 1000, Status: "active"},
				{ID: 2, Nama: "Gudang B", Kode: "WH002", Alamat: "Jl. Pabrik No. 2", Kota: "Surabaya", Provinsi: "Jawa Timur", Kapasitas: 800, Status: "active"},
			}
			c.JSON(http.StatusOK, warehouses)
			return
		}
		
		if err := db.Find(&warehouses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, warehouses)
	}
}

func CreateWarehouse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var warehouse models.Warehouse
		if err := c.ShouldBindJSON(&warehouse); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message":   "Warehouse created successfully (in memory)",
				"warehouse": warehouse,
			})
			return
		}
		
		if err := db.Create(&warehouse).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusCreated, warehouse)
	}
}

func UpdateWarehouse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		var warehouse models.Warehouse
		if err := c.ShouldBindJSON(&warehouse); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message":   "Warehouse updated successfully (in memory)",
				"warehouse": warehouse,
			})
			return
		}
		
		if err := db.Model(&models.Warehouse{}).Where("id = ?", id).Updates(warehouse).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		warehouse.ID = uint(id)
		c.JSON(http.StatusOK, warehouse)
	}
}

func DeleteWarehouse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Warehouse deleted successfully (in memory)",
			})
			return
		}
		
		if err := db.Delete(&models.Warehouse{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Warehouse deleted successfully"})
	}
}
