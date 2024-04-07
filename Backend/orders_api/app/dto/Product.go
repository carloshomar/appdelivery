package dto

type ProductRequest struct {
	Id              int     `json:id`
	Name            string  `json:name`
	Description     string  `json:description`
	Price           float64 `json:price`
	Image           string  `json:image`
	EstablishmentID int     `json:establishmentId`
}

type AdditionalRequest struct {
	Id              int     `json:id`
	Name            string  `json:name`
	Price           float64 `json:price`
	Image           string  `json:image`
	Description     string  `json:description`
	EstablishmentID uint    `json:establishmentId`
}

type AdditionalProductsRequest struct {
	Id              int  `json:id`
	ProductID       uint `json:productId"`
	AdditionalID    uint `json:additionalId"`
	EstablishmentID uint `json:establishmentId`
}

type CategoryRequest struct {
	ID         uint `json:id`
	ProductID  uint `json:productId`
	CategoryID uint `json:categoryId`
}
