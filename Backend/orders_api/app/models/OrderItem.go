package models

type OrderItem struct {
	ID           uint `gorm:"primaryKey"`
	OrderID      uint
	ProductID    uint `gorm:"foreignKey:IDProduto"`
	Quantity     int
	Observations string
}
