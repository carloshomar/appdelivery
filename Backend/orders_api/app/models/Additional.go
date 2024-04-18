package models

type Additional struct {
	ID              uint `gorm:"primaryKey"`
	Name            string
	Price           float64
	Image           string
	Description     string
	EstablishmentID uint
}
