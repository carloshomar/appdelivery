package models

type Order struct {
	ID              uint `gorm:"primaryKey"`
	UserID          uint `gorm:"foreignKey:IDUsuario"`
	EstablishmentID uint
	OrderDate       string
	Status          string // Pending, In Progress, Delivered, etc.
}
