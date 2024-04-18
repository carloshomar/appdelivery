package handlers

import (
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func CalculateDeliveryValue(c *fiber.Ctx) error {
	var request struct {
		Distance        float32 `json:"distance"`
		EstablishmentID int64   `json:"establishmentId"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}

	// Se establishmentId não estiver presente na solicitação, definimos o valor padrão como 1 (matriz)
	if request.EstablishmentID == 0 {
		request.EstablishmentID = 1
	}

	var delivery models.Delivery
	if err := models.DB.Where("establishment_id = ?", request.EstablishmentID).First(&delivery).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch delivery settings",
		})
	}

	// Calcular o valor da entrega
	deliveryValue := (request.Distance * delivery.PerKm) + delivery.FixedTaxa

	return c.JSON(fiber.Map{
		"deliveryValue": deliveryValue,
	})
}

func InsertDelivery(c *fiber.Ctx) error {
	var request struct {
		EstablishmentID uint    `json:"establishmentId"`
		FixedTaxa       float32 `json:"fixedTaxa"`
		PerKm           float32 `json:"perKm"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}

	newDelivery := models.Delivery{
		EstablishmentID: request.EstablishmentID,
		FixedTaxa:       request.FixedTaxa,
		PerKm:           request.PerKm,
	}

	if err := models.CreateOrUpdateDelivery(&newDelivery); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to insert or update delivery data",
		})
	}

	return c.JSON(fiber.Map{
		"delivery": newDelivery,
	})
}
