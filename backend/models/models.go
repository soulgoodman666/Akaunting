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
	ID         uint           `json:"id" gorm:"primaryKey"`
	Name       string         `json:"name" gorm:"not null"`
	Email      string         `json:"email"`
	Phone      string         `json:"phone"`
	Address    string         `json:"address"`
	City       string         `json:"city"`
	Country    string         `json:"country"`
	PostalCode string         `json:"postal_code"`
	TaxNumber  string         `json:"tax_number"`
	Website    string         `json:"website"`
	Logo       string         `json:"logo"`
	Enabled    bool           `json:"enabled" gorm:"default:true"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

// Account represents an account in the system
type Account struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Number    string         `json:"number"`
	Type      string         `json:"type" gorm:"not null"` // asset, liability, equity, revenue, expense
	Currency  string         `json:"currency" gorm:"default:USD"`
	Balance   float64        `json:"balance" gorm:"default:0"`
	Enabled   bool           `json:"enabled" gorm:"default:true"`
	CompanyID uint           `json:"company_id"`
	Company   Company        `json:"company" gorm:"foreignKey:CompanyID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Transaction represents a transaction in the system
type Transaction struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Number      string         `json:"number"`
	Type        string         `json:"type" gorm:"not null"` // income, expense, transfer, stock_in, stock_out, adjustment
	Description string         `json:"description"`
	Amount      float64        `json:"amount" gorm:"not null"`
	Currency    string         `json:"currency" gorm:"default:USD"`
	Date        time.Time      `json:"date"`
	Reference   string         `json:"reference"`
	Attachment  string         `json:"attachment"`
	CompanyID   uint           `json:"company_id"`
	Company     Company        `json:"company" gorm:"foreignKey:CompanyID"`
	AccountID   uint           `json:"account_id"`
	Account     Account        `json:"account" gorm:"foreignKey:AccountID"`
	CategoryID  uint           `json:"category_id"`
	Category    Category       `json:"category" gorm:"foreignKey:CategoryID"`
	ItemID      uint           `json:"item_id"`
	Item        Item           `json:"item" gorm:"foreignKey:ItemID"`
	WarehouseID uint           `json:"warehouse_id"`
	Warehouse   Warehouse      `json:"warehouse" gorm:"foreignKey:WarehouseID"`
	UserID      uint           `json:"user_id"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	Quantity    int            `json:"quantity"`
	Status      string         `json:"status" gorm:"default:completed"` // pending, completed, cancelled
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
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

// Item represents an inventory item
type Item struct {
	ID                 uint           `json:"id" gorm:"primaryKey"`
	Kode               string         `json:"kode" gorm:"unique;not null"`
	Nama               string         `json:"nama" gorm:"not null"`
	Merek              string         `json:"merek"`
	Kategori           string         `json:"kategori"`
	Satuan             string         `json:"satuan"`
	Jumlah             int            `json:"jumlah"`
	InitialQuantity    int            `json:"initial_quantity"`
	QuantityPercentage int            `json:"quantity_percentage"`
	Harga              float64        `json:"harga"`
	Status             string         `json:"status" gorm:"default:active"`
	Supplier           string         `json:"supplier"`
	Lokasi             string         `json:"lokasi"`
	TanggalMasuk       string         `json:"tanggal_masuk"`
	Deskripsi          string         `json:"deskripsi"`
	GudangID           uint           `json:"gudang_id"`
	Gudang             Warehouse      `json:"gudang" gorm:"foreignKey:GudangID"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `json:"-" gorm:"index"`
}

// Group represents an item group
type Group struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Nama      string         `json:"nama" gorm:"not null"`
	Deskripsi string         `json:"deskripsi"`
	Kategori  string         `json:"kategori"`
	Status    string         `json:"status" gorm:"default:active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Items     []Item         `json:"items" gorm:"many2many:group_items;"`
}

// GroupItem represents the many-to-many relationship between groups and items
type GroupItem struct {
	GroupID uint `json:"group_id"`
	ItemID  uint `json:"item_id"`
}

// Warehouse represents a warehouse location
type Warehouse struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	Nama       string         `json:"nama" gorm:"not null"`
	Kode       string         `json:"kode" gorm:"unique;not null"`
	Alamat     string         `json:"alamat"`
	Kota       string         `json:"kota"`
	Provinsi   string         `json:"provinsi"`
	Telepon    string         `json:"telepon"`
	Manager    string         `json:"manager"`
	VolumeLuas float64        `json:"volume_luas"` // dalam meter persegi
	Kapasitas  int            `json:"kapasitas"`
	Status     string         `json:"status" gorm:"default:active"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

// TransferOrder represents a transfer order
type TransferOrder struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	Kode            string         `json:"kode" gorm:"unique;not null"`
	ItemID          uint           `json:"item_id"`
	Item            Item           `json:"item" gorm:"foreignKey:ItemID"`
	FromWarehouseID uint           `json:"from_warehouse_id"`
	FromWarehouse   Warehouse      `json:"from_warehouse" gorm:"foreignKey:FromWarehouseID"`
	ToWarehouseID   uint           `json:"to_warehouse_id"`
	ToWarehouse     Warehouse      `json:"to_warehouse" gorm:"foreignKey:ToWarehouseID"`
	Jumlah          int            `json:"jumlah"`
	Status          string         `json:"status" gorm:"default:pending"` // pending, approved, completed, cancelled
	TanggalTransfer string         `json:"tanggal_transfer"`
	Catatan         string         `json:"catatan"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName untuk TransferOrder
func (TransferOrder) TableName() string {
	return "transfer_orders"
}
