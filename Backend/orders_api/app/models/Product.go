package models

type Product struct {
	ID              uint   `gorm:"primaryKey"`
	Name            string `gorm:"not null"`
	Description     string
	Price           float64 `gorm:"not null"`
	Image           string
	EstablishmentID uint
	Categories      []Category   `gorm:"many2many:category_products;"`
	Additional      []Additional `gorm:"many2many:additional_products;foreignKey:ID;joinForeignKey:ProductID;joinReferences:AdditionalID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
