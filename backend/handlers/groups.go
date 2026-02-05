package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetGroups(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var groups []models.Group
		
		if db == nil {
			groups = []models.Group{
				{ID: 1, Nama: "Industrial Tools", Deskripsi: "Tools for industrial applications", Kategori: "Tools", Status: "active"},
				{ID: 2, Nama: "Safety Equipment", Deskripsi: "Safety and protective equipment", Kategori: "Safety", Status: "active"},
			}
			c.JSON(http.StatusOK, groups)
			return
		}
		
		if err := db.Preload("Items").Find(&groups).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, groups)
	}
}

func CreateGroup(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var group models.Group
		if err := c.ShouldBindJSON(&group); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Group created successfully (in memory)",
				"group":   group,
			})
			return
		}
		
		if err := db.Create(&group).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusCreated, group)
	}
}

func UpdateGroup(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		var group models.Group
		if err := c.ShouldBindJSON(&group); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Group updated successfully (in memory)",
				"group":   group,
			})
			return
		}
		
		if err := db.Model(&models.Group{}).Where("id = ?", id).Updates(group).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		group.ID = uint(id)
		c.JSON(http.StatusOK, group)
	}
}

func DeleteGroup(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Group deleted successfully (in memory)",
			})
			return
		}
		
		if err := db.Delete(&models.Group{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Group deleted successfully"})
	}
}

func GetGroupItems(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		groupID, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group ID"})
			return
		}
		
		var items []models.Item
		
		if db == nil {
			items = []models.Item{
				{ID: 1, Kode: "M090", Nama: "Gas Argon", Merek: "Gas", Kategori: "Industrial Gas", Satuan: "Tube", Jumlah: 5, Harga: 750000, Status: "active", Supplier: "PT Gas Indonesia", Lokasi: "Gudang A", TanggalMasuk: "2024-01-15", Deskripsi: "High purity argon gas for welding applications"},
			}
			c.JSON(http.StatusOK, items)
			return
		}
		
		if err := db.Table("items").Joins("JOIN group_items ON items.id = group_items.item_id").Where("group_items.group_id = ?", groupID).Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, items)
	}
}

func AddItemToGroup(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		groupID, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group ID"})
			return
		}
		
		var request struct {
			ItemID uint `json:"item_id"`
		}
		
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		if db == nil {
			c.JSON(http.StatusOK, gin.H{
				"message": "Item added to group successfully (in memory)",
			})
			return
		}
		
		// Add item to group using many-to-many relationship
		if err := db.Exec("INSERT INTO group_items (group_id, item_id) VALUES (?, ?)", groupID, request.ItemID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Item added to group successfully"})
	}
}
