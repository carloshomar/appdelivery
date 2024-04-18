package handlers

import (
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func CalculateDeliveryValue(c *fiber.Ctx) error {
	// Extrair a distância do corpo da requisição
	var request struct {
		Distance        float32 `json:"distance"`
		EstablishmentID int64   `json:"establishmentId"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}

	// Se establishmentId não estiver presente na solicitação, definimos o valor padrão como 1
	if request.EstablishmentID == 0 {
		request.EstablishmentID = 1
	}

	// Consultar no banco de dados para obter as configurações de entrega específicas do estabelecimento
	var delivery models.Delivery
	if err := models.DB.Where("establishment_id = ?", request.EstablishmentID).First(&delivery).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch delivery settings",
		})
	}

	// Calcular o valor de entrega usando a fórmula mencionada
	deliveryValue := (request.Distance * delivery.PerKm) + delivery.FixedTaxa

	// Retornar o valor de entrega calculado
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

	// Criar um novo objeto Delivery
	newDelivery := models.Delivery{
		EstablishmentID: request.EstablishmentID,
		FixedTaxa:       request.FixedTaxa,
		PerKm:           request.PerKm,
	}

	// Chamar a função CreateOrUpdateDelivery para inserir ou atualizar no banco de dados
	if err := models.CreateOrUpdateDelivery(&newDelivery); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to insert or update delivery data",
		})
	}

	// Retornar a resposta com o objeto inserido ou atualizado
	return c.JSON(fiber.Map{
		"delivery": newDelivery,
	})
}
