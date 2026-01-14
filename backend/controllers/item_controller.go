package controllers

import (
	"net/http"
	"strconv"

	"backend/config"
	"backend/models"
	"github.com/gin-gonic/gin"
)


// GET /items
func GetItems(c *gin.Context) {
	rows, err := config.DB.Query(
		"SELECT id, group_id, name, stock FROM items",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.Item

	for rows.Next() {
		var item models.Item
		rows.Scan(&item.ID, &item.GroupID, &item.Name, &item.Stock)
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}


// GET /groups/:id/items
func GetItemsByGroup(c *gin.Context) {
	groupID, _ := strconv.Atoi(c.Param("id"))

	rows, err := config.DB.Query(
		"SELECT id, group_id, name, stock FROM items WHERE group_id = ?",
		groupID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.Item

	for rows.Next() {
		var item models.Item
		rows.Scan(&item.ID, &item.GroupID, &item.Name, &item.Stock)
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}


// POST /items
func CreateItem(c *gin.Context) {
	var item models.Item
	if err := c.BindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := config.DB.Exec(
		"INSERT INTO items (group_id, name, stock) VALUES (?, ?, ?)",
		item.GroupID, item.Name, item.Stock,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item created"})
}
