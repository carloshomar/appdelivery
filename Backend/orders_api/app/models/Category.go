package models

type Category struct {
	ID              uint   `gorm:"primaryKey"`
	Name            string `gorm:"not null"`
	Image           string
	EstablishmentID uint
	Products        []Product `gorm:"many2many:category_products;"`
}
