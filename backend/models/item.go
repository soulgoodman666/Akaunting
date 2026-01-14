package models

type Item struct {
	ID      int    `json:"id"`
	GroupID int    `json:"group_id"`
	Name    string `json:"name"`
	Stock   int    `json:"stock"`
}
