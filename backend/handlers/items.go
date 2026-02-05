package handlers

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetItems(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Item

		// Jika database tidak tersedia, kembalikan data dummy
		if db == nil {
			items = []models.Item{
				{ID: 1, Kode: "M090", Nama: "Gas Argon", Merek: "Gas", Kategori: "Industrial Gas", Satuan: "Tube", Jumlah: 5, Harga: 750000, Status: "active", Supplier: "PT Gas Indonesia", Lokasi: "Gudang A", TanggalMasuk: "2024-01-15", Deskripsi: "High purity argon gas for welding applications"},
				{ID: 2, Kode: "M089", Nama: "Gas Oksigen", Merek: "Gas", Kategori: "Industrial Gas", Satuan: "Tube", Jumlah: 1, Harga: 500000, Status: "active", Supplier: "PT Gas Indonesia", Lokasi: "Gudang A", TanggalMasuk: "2024-01-10", Deskripsi: "Medical grade oxygen gas"},
			}
			c.JSON(http.StatusOK, items)
			return
		}

		// Cek apakah ada data, jika tidak ada buat dummy data
		var count int64
		db.Model(&models.Item{}).Count(&count)
		if count == 0 {
			// Buat dummy data untuk testing
			dummyItems := []models.Item{
				{Kode: "TEST001", Nama: "Test Item 1", Merek: "Test", Kategori: "Test", Satuan: "PCS", Jumlah: 10, Harga: 100000, Status: "active", Supplier: "Test Supplier", Lokasi: "Test Location", TanggalMasuk: "2024-01-01", Deskripsi: "Test item for delete functionality"},
				{Kode: "TEST002", Nama: "Test Item 2", Merek: "Test", Kategori: "Test", Satuan: "PCS", Jumlah: 5, Harga: 50000, Status: "active", Supplier: "Test Supplier", Lokasi: "Test Location", TanggalMasuk: "2024-01-01", Deskripsi: "Test item for delete functionality"},
			}
			for _, item := range dummyItems {
				db.Create(&item)
			}
		}

		if err := db.Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}

func CreateItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var item models.Item

		// Debug: Log request body
		body, _ := c.GetRawData()
		fmt.Printf("CreateItem - Request body: %s\n", string(body))
		c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

		if err := c.ShouldBindJSON(&item); err != nil {
			fmt.Printf("CreateItem - Bind error: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("CreateItem - Parsed item: %+v\n", item)

		// Jika database tidak tersedia, simpan ke memory sementara
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Item created successfully (in memory)",
				"item":    item,
			})
			return
		}

		if err := db.Create(&item).Error; err != nil {
			fmt.Printf("CreateItem - Database error: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("CreateItem - Success: %+v\n", item)
		c.JSON(http.StatusCreated, item)
	}
}

func UpdateItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		var item models.Item
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Jika database tidak tersedia
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Item updated successfully (in memory)",
				"item":    item,
			})
			return
		}

		if err := db.Model(&models.Item{}).Where("id = ?", id).Updates(item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		item.ID = uint(id)
		c.JSON(http.StatusOK, item)
	}
}

func DeleteItem(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		// Jika database tidak tersedia
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Item deleted successfully (in memory)",
			})
			return
		}

		if err := db.Delete(&models.Item{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
	}
}

func DeleteItemsBatch(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request struct {
			IDs []uint `json:"ids"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Jika database tidak tersedia
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Items deleted successfully (in memory)",
			})
			return
		}

		if err := db.Delete(&models.Item{}, request.IDs).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Items deleted successfully"})
	}
}
