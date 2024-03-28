package dto

type Additional struct {
	ID          int     `json:"ID"`
	Name        string  `json:"Name"`
	Price       float64 `json:"Price"`
	Image       string  `json:"Image"`
	Description string  `json:"Description"`
}

type Item struct {
	ID              int          `json:"ID"`
	Name            string       `json:"Name"`
	Description     string       `json:"Description"`
	Price           float64      `json:"Price"`
	Image           string       `json:"Image"`
	EstablishmentID int          `json:"EstablishmentID"`
	Categories      interface{}  `json:"Categories"`
	Additional      []Additional `json:"Additional"`
}

type CartItem struct {
	Item        Item   `json:"item"`
	Additionals []int  `json:"additionals"`
	Quantity    int    `json:"quantity"`
	ID          string `json:"id"`
}

type Coords struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Location struct {
	Cep         string `json:"cep"`
	Logradouro  string `json:"logradouro"`
	Complemento string `json:"complemento"`
	Bairro      string `json:"bairro"`
	Localidade  string `json:"localidade"`
	UF          string `json:"uf"`
	IBGE        string `json:"ibge"`
	GIA         string `json:"gia"`
	DDD         string `json:"ddd"`
	Siafi       string `json:"siafi"`
	Numero      string `json:"numero"`
	Coords      Coords `json:"coords"`
}

type User struct {
	Phone string `json:"phone"`
	Nome  string `json:"nome"`
}

type PaymentMethod struct {
	Type string `json:"type"`
	Icon string `json:"icon"`
}

type Establishment struct {
	HorarioFuncionamento string
	Id                   int64
	Image                string
	Latitude             float64 `json:"lat"`
	Longitude            float64 `json:"long"`
	MaxDistanceDelivery  float64 `json:"max_distance_delivery"`
	Name                 string  `json:"name"`
	OwnerId              int64   `json:"owner_id"`
	PrimaryCollor        string  `json:"primary_color"`
	SecondaryCollor      string  `json:"secondary_color"`
	LocationString       string  `json:"location_string"`
}

type DeliveryMan struct {
	Email  string `json:"email"`
	Id     int64  `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type RequestPayload struct {
	Cart            []CartItem    `json:"cart"`
	Distance        float64       `json:"distance"`
	Location        Location      `json:"location"`
	Status          string        `json:"status"`
	PaymentMethod   PaymentMethod `json:"paymentMethod"`
	DeliveryValue   float64       `json:"deliveryValue"`
	User            User          `json:"user"`
	EstablishmentId int64         `json:"establishmentId"`
	Establishment   Establishment `json:"establishment"`
	OrderId         string        `json:"order_id" `
	DeliveryMan     DeliveryMan   `json:"deliveryman"`
}

type UpdateOrderStatusRequest struct {
	ID     string `json:"id"`
	Status string `json:"status"`
}
