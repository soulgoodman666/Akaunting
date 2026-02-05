package services

import (
	"fmt"
	"time"

	"backend/models"

	"gorm.io/gorm"
)

type HistoryService struct {
	db *gorm.DB
}

func NewHistoryService(db *gorm.DB) *HistoryService {
	return &HistoryService{db: db}
}

// CreateItemHistory creates a history record when item is added/updated
func (s *HistoryService) CreateItemHistory(item *models.Item, action string, userID uint) error {
	transaction := &models.Transaction{
		Number:      generateTransactionNumber("ITEM"),
		Type:        "stock_in",
		Description: fmt.Sprintf("%s item: %s", action, item.Nama),
		Amount:      float64(item.Harga) * float64(item.Jumlah),
		Currency:    "IDR",
		Date:        time.Now(),
		Reference:   item.Kode,
		ItemID:      item.ID,
		WarehouseID: getWarehouseIDFromItem(item),
		UserID:      userID,
		Quantity:    item.Jumlah,
		Status:      "completed",
	}

	return s.db.Create(transaction).Error
}

// CreateTransferHistory creates a history record when transfer is created/updated
func (s *HistoryService) CreateTransferHistory(transfer *models.TransferOrder, action string, userID uint) error {
	var transactionType string
	var description string

	switch transfer.Status {
	case "pending":
		transactionType = "transfer"
		description = fmt.Sprintf("Transfer initiated: %s from %s to %s",
			getItemName(s.db, transfer.ItemID),
			getWarehouseName(s.db, transfer.FromWarehouseID),
			getWarehouseName(s.db, transfer.ToWarehouseID))
	case "approved":
		transactionType = "transfer"
		description = fmt.Sprintf("Transfer approved: %s from %s to %s",
			getItemName(s.db, transfer.ItemID),
			getWarehouseName(s.db, transfer.FromWarehouseID),
			getWarehouseName(s.db, transfer.ToWarehouseID))
	case "in_transit":
		transactionType = "transfer"
		description = fmt.Sprintf("Transfer in transit: %s from %s to %s",
			getItemName(s.db, transfer.ItemID),
			getWarehouseName(s.db, transfer.FromWarehouseID),
			getWarehouseName(s.db, transfer.ToWarehouseID))
	case "completed":
		transactionType = "transfer"
		description = fmt.Sprintf("Transfer completed: %s from %s to %s",
			getItemName(s.db, transfer.ItemID),
			getWarehouseName(s.db, transfer.FromWarehouseID),
			getWarehouseName(s.db, transfer.ToWarehouseID))
	default:
		transactionType = "transfer"
		description = fmt.Sprintf("Transfer %s: %s", transfer.Status, getItemName(s.db, transfer.ItemID))
	}

	transaction := &models.Transaction{
		Number:      generateTransactionNumber("TRF"),
		Type:        transactionType,
		Description: description,
		Amount:      0, // Transfer doesn't affect monetary value
		Currency:    "IDR",
		Date:        time.Now(),
		Reference:   transfer.Kode,
		ItemID:      transfer.ItemID,
		WarehouseID: transfer.FromWarehouseID,
		UserID:      userID,
		Quantity:    transfer.Jumlah,
		Status:      transfer.Status,
	}

	return s.db.Create(transaction).Error
}

// CreateStockReductionHistory creates a history record when stock is reduced
func (s *HistoryService) CreateStockReductionHistory(item *models.Item, reductionAmount int, reason string, userID uint) error {
	transaction := &models.Transaction{
		Number:      generateTransactionNumber("RED"),
		Type:        "stock_out",
		Description: fmt.Sprintf("Stock reduction: %s - %d units - Reason: %s", item.Nama, reductionAmount, reason),
		Amount:      float64(reductionAmount) * float64(item.Harga),
		Currency:    "IDR",
		Date:        time.Now(),
		Reference:   item.Kode,
		ItemID:      item.ID,
		WarehouseID: getWarehouseIDFromItem(item),
		UserID:      userID,
		Quantity:    -reductionAmount, // Negative for stock out
		Status:      "completed",
	}

	return s.db.Create(transaction).Error
}

// GetHistoryByItemID retrieves all history for a specific item
func (s *HistoryService) GetHistoryByItemID(itemID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := s.db.Where("item_id = ?", itemID).
		Preload("Item").
		Preload("Warehouse").
		Preload("User").
		Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

// GetHistoryByWarehouseID retrieves all history for a specific warehouse
func (s *HistoryService) GetHistoryByWarehouseID(warehouseID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := s.db.Where("warehouse_id = ?", warehouseID).
		Preload("Item").
		Preload("Warehouse").
		Preload("User").
		Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

// GetAllHistory retrieves all transaction history
func (s *HistoryService) GetAllHistory() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := s.db.Preload("Item").
		Preload("Warehouse").
		Preload("User").
		Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

// Helper functions
func generateTransactionNumber(prefix string) string {
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("%s-%s", prefix, timestamp)
}

func getWarehouseIDFromItem(item *models.Item) uint {
	// This would need to be implemented based on how gudang_id is stored
	// For now, return 0 as placeholder
	if item.GudangID != 0 {
		return item.GudangID
	}
	return 0
}

func getItemName(db *gorm.DB, itemID uint) string {
	var item models.Item
	if err := db.First(&item, itemID).Error; err == nil {
		return item.Nama
	}
	return "Unknown Item"
}

func getWarehouseName(db *gorm.DB, warehouseID uint) string {
	var warehouse models.Warehouse
	if err := db.First(&warehouse, warehouseID).Error; err == nil {
		return warehouse.Nama
	}
	return "Unknown Warehouse"
}
