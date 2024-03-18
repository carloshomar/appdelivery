package dto

type Location struct {
	CEP         string      `json:"cep"`
	Logradouro  string      `json:"logradouro"`
	Complemento string      `json:"complemento"`
	Bairro      string      `json:"bairro"`
	Localidade  string      `json:"localidade"`
	UF          string      `json:"uf"`
	IBGE        string      `json:"ibge"`
	GIA         string      `json:"gia"`
	DDD         string      `json:"ddd"`
	SIAFI       string      `json:"siafi"`
	Numero      string      `json:"numero"`
	Coords      Coordinates `json:"coords"`
}

type Coordinates struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type PaymentMethod struct {
	Type string `json:"type"`
	Icon string `json:"icon"`
}

type User struct {
	Phone string `json:"phone"`
	Nome  string `json:"nome"`
}

type Establishment struct {
	HorarioFuncionamento string  `json:"HorarioFuncionamento"`
	ID                   int     `json:"Id"`
	Image                string  `json:"Image"`
	Lat                  float64 `json:"lat"`
	Long                 float64 `json:"long"`
	MaxDistanceDelivery  float64 `json:"max_distance_delivery"`
	Name                 string  `json:"name"`
	OwnerID              int     `json:"owner_id"`
	PrimaryColor         string  `json:"primary_color"`
	SecondaryColor       string  `json:"secondary_color"`
	LocationString       string  `json:"location_string"`
}

type DeliveryMan struct {
	Email string `json:"email"`
	Id    int64  `json:"id"`
	Name  string `json:"name"`
}

type OrderDTO struct {
	Distance        float64       `json:"distance"`
	Location        Location      `json:"location"`
	Status          string        `json:"status"`
	PaymentMethod   PaymentMethod `json:"paymentMethod"`
	DeliveryValue   float64       `json:"deliveryValue"`
	User            User          `json:"user"`
	EstablishmentID int           `json:"establishmentId"`
	Establishment   Establishment `json:"establishment"`
	OrderId         string        `json:"order_id"`
	DeliveryMan     DeliveryMan   `json:"deliveryman"`
}
