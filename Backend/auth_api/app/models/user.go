package models

type User struct {
	ID              uint   `gorm:"primaryKey" json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	EstablishmentID uint   `json:"establishment_id"`
}
