package dto

import (
	"github.com/carloshomar/vercardapio/app/models"
)

type CategorieRequest struct {
	Id                  uint             `json:id`
	Name                string           `json:name`
	Image               string           `json:image`
	MaxDistanceDelivery int              "json:max_distance_delivery"
	EstablishmentId     uint             `json:establishmentId`
	Products            []models.Product `json:products`
}
