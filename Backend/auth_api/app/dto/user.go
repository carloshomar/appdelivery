package dto

type CreateUserRequest struct {
	Id            int                  `json:"id"`
	Name          string               `json:"name"`
	Email         string               `json:"email"`
	Password      string               `json:"password"`
	Establishment EstablishmentRequest `json:"establishment"`
}

type EstablishmentRequest struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	Image          string `json:image`
	PrimaryColor   string `json:"primary_color"`
	SecondaryColor string `json:"secodary_color"`

	HorarioFuncionamento string  `json:"horarioFuncionamento"`
	Lat                  float64 `json:"lat"`
	Long                 float64 `json:"long"`
	LocationString       string  `json:"location_string"`

	MaxDistanceDelivery float64 `json:"max_distance_delivery"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateDeliveryManRequest struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
