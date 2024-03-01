package models

type CategoryProducts struct {
	ProductID  uint
	CategoryID uint
	Category   Category `gorm:"foreignKey:CategoryID"`
	Product    Product  `gorm:"foreignKey:ProductID"`
}
