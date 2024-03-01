package models

type Delivery struct {
	ID              uint `gorm:"primaryKey"`
	EstablishmentID uint
	FixedTaxa       float32
	PerKm           float32
}

func CreateOrUpdateDelivery(delivery *Delivery) error {
	var existingDelivery Delivery

	// Tente encontrar o registro existente
	err := DB.Where(Delivery{EstablishmentID: delivery.EstablishmentID}).First(&existingDelivery).Error
	if err != nil {
		// Se não encontrar, crie um novo
		return DB.Create(delivery).Error
	}

	// Se encontrar, atualize os valores
	return DB.Model(&existingDelivery).Updates(delivery).Error
}
