package models

type Group struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Items    int    `json:"items"`
}
