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
}

type User struct {
	Phone string `json:"phone"`
	Nome  string `json:"nome"`
}

type PaymentMethod struct {
	Type string `json:"type"`
	Icon string `json:"icon"`
}

type RequestPayload struct {
	Cart            []CartItem    `json:"cart"`
	Distance        float64       `json:"distance"`
	Location        Location      `json:"location"`
	PaymentMethod   PaymentMethod `json:"paymentMethod"`
	DeliveryValue   float64       `json:"deliveryValue"`
	User            User          `json:"user"`
	EstablishmentId int64         `json:"establishmentId"`
}
