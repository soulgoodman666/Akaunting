package controllers

import (
	"net/http"

	"backend/config"
	"backend/models"
	"github.com/gin-gonic/gin"
)

func GetGroups(c *gin.Context) {
	rows, _ := config.DB.Query("SELECT id, name, category, items FROM groups")

	var groups []models.Group
	for rows.Next() {
		var g models.Group
		rows.Scan(&g.ID, &g.Name, &g.Category, &g.Items)
		groups = append(groups, g)
	}

	c.JSON(http.StatusOK, groups)
}

func GetGroupByID(c *gin.Context) {
	id := c.Param("id")
	row := config.DB.QueryRow(
		"SELECT id, name, category, items FROM groups WHERE id = ?", id,
	)

	var g models.Group
	row.Scan(&g.ID, &g.Name, &g.Category, &g.Items)

	c.JSON(http.StatusOK, g)
}
