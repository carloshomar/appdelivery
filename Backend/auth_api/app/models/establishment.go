package models

type Establishment struct {
	ID                   uint   `gorm:"primaryKey" json:"id"`
	Name                 string `json:"name"`
	HorarioFuncionamento string `json:"horarioFuncionamento"`
	Description          string `json:"description"`
	OwnerID              uint   `json:"owner_id"`
	Image                string `json:"image"`
	PrimaryColor         string `json:"primary_color"`
	SecondaryColor       string `json:"secondary_color"`

	Lat                 float64 `json:"lat"`
	Long                float64 `json:"long"`
	LocationString      string  `json:"location_string"`
	MaxDistanceDelivery float64 `json:"max_distance_delivery"`
}
