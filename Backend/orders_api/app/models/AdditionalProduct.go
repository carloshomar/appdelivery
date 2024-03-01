package models

type AdditionalProducts struct {
	ProductID    uint
	AdditionalID uint
	Product      Product    `gorm:"foreignKey:ProductID"`
	Additional   Additional `gorm:"foreignKey:AdditionalID"`
}
