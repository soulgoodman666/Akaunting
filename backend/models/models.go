package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	FirstName string         `json:"first_name" gorm:"not null"`
	LastName  string         `json:"last_name" gorm:"not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Phone     string         `json:"phone"`
	Enabled   bool           `json:"enabled" gorm:"default:true"`
	Role      string         `json:"role" gorm:"default:user"`
	CompanyID uint           `json:"company_id"`
	Company   Company        `json:"company" gorm:"foreignKey:CompanyID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Company represents a company in the system
type Company struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Email       string         `json:"email"`
	Phone       string         `json:"phone"`
	Address     string         `json:"address"`
	City        string         `json:"city"`
	Country     string         `json:"country"`
	PostalCode  string         `json:"postal_code"`
	TaxNumber   string         `json:"tax_number"`
	Website     string         `json:"website"`
	Logo        string         `json:"logo"`
	Enabled     bool           `json:"enabled" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// Account represents an account in the system
type Account struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Number      string         `json:"number"`
	Type        string         `json:"type" gorm:"not null"` // asset, liability, equity, revenue, expense
	Currency    string         `json:"currency" gorm:"default:USD"`
	Balance     float64        `json:"balance" gorm:"default:0"`
	Enabled     bool           `json:"enabled" gorm:"default:true"`
	CompanyID   uint           `json:"company_id"`
	Company     Company        `json:"company" gorm:"foreignKey:CompanyID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// Transaction represents a transaction in the system
type Transaction struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	Number        string         `json:"number"`
	Type          string         `json:"type" gorm:"not null"` // income, expense, transfer
	Description   string         `json:"description"`
	Amount        float64        `json:"amount" gorm:"not null"`
	Currency      string         `json:"currency" gorm:"default:USD"`
	Date          time.Time      `json:"date"`
	Reference     string         `json:"reference"`
	Attachment    string         `json:"attachment"`
	CompanyID     uint           `json:"company_id"`
	Company       Company        `json:"company" gorm:"foreignKey:CompanyID"`
	AccountID     uint           `json:"account_id"`
	Account       Account        `json:"account" gorm:"foreignKey:AccountID"`
	CategoryID    uint           `json:"category_id"`
	Category      Category       `json:"category" gorm:"foreignKey:CategoryID"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

// Category represents a category in the system
type Category struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Type      string         `json:"type" gorm:"not null"` // income, expense
	Color     string         `json:"color"`
	Enabled   bool           `json:"enabled" gorm:"default:true"`
	CompanyID uint           `json:"company_id"`
	Company   Company        `json:"company" gorm:"foreignKey:CompanyID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
