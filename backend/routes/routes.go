package routes

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	//group
	r.GET("/groups", controllers.GetGroups)
	r.GET("/groups/:id", controllers.GetGroupByID)
	// items
	r.GET("/items", controllers.GetItems)
	r.POST("/items", controllers.CreateItem)
	r.GET("/groups/:id/items", controllers.GetItemsByGroup)
}