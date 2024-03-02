package dto

import (
	"github.com/carloshomar/vercardapio/app/models"
)

type CategorieRequest struct {
	Id              uint             `json:id`
	Name            string           `json:name`
	Image           string           `json:image`
	EstablishmentId uint             `json:establishmentId`
	Products        []models.Product `json:products`
}
