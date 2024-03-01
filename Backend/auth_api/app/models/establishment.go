package models

type Establishment struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	OwnerID     uint   `json:"owner_id"`

	Image          string `json:image`
	PrimaryColor   string `json:"primary_color"`
	SecondaryColor string `json:"secodary_color"`
}
