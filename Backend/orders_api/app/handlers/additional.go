package handlers

import (
	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func CreateAdditional(c *fiber.Ctx) error {
	var request dto.AdditionalRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	additional := models.Additional{
		Name:            request.Name,
		Price:           request.Price,
		Image:           request.Image,
		Description:     request.Description,
		EstablishmentID: request.EstablishmentID,
	}

	models.DB.Create(&additional)

	return c.JSON(&additional)
}

func ListAdditional(c *fiber.Ctx) error {
	establishmentId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse establishment ID"})
	}

	var additionals []models.Additional
	if err := models.DB.Where("establishment_id = ?", establishmentId).Find(&additionals).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch additional items"})
	}

	return c.JSON(additionals)
}

func UpdateAdditional(c *fiber.Ctx) error {
	// Obter o ID do item adicional dos parâmetros da rota
	additionalID := c.Params("id")

	// Verificar se o item adicional existe no banco de dados
	var existingAdditional models.Additional
	if err := models.DB.First(&existingAdditional, additionalID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Additional item not found"})
	}

	// Analisar a solicitação do corpo para obter os dados de atualização
	var request dto.AdditionalRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Atualizar os campos relevantes do item adicional com os dados fornecidos na solicitação
	existingAdditional.Name = request.Name
	existingAdditional.Price = request.Price
	existingAdditional.Image = request.Image
	existingAdditional.Description = request.Description

	// Salvar as alterações no banco de dados
	if err := models.DB.Save(&existingAdditional).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update additional item"})
	}

	return c.JSON(existingAdditional)
}

func CreateProductToAdditional(c *fiber.Ctx) error {
	var request dto.AdditionalProductsRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Verificar se o produto existe
	var existingProduct models.Product
	result := models.DB.First(&existingProduct, request.ProductID)
	if result.Error != nil {
		// Se houver um erro, o produto não existe
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product not found"})
	}

	// Verificar se o relacionamento já existe
	var existingAdditionalProducts models.AdditionalProducts
	result = models.DB.Where(&models.AdditionalProducts{
		ProductID:    request.ProductID,
		AdditionalID: request.AdditionalID,
	}).First(&existingAdditionalProducts)

	if result.RowsAffected > 0 {
		// O relacionamento já existe, então vamos removê-lo
		models.DB.Where(&models.AdditionalProducts{
			ProductID:    request.ProductID,
			AdditionalID: request.AdditionalID,
		}).Delete(&existingAdditionalProducts)
		return c.JSON(&existingAdditionalProducts)
	}

	// Agora podemos criar o AdditionalProducts
	additionalProducts := models.AdditionalProducts{
		ProductID:    request.ProductID,
		AdditionalID: request.AdditionalID,
	}

	models.DB.Create(&additionalProducts)

	return c.JSON(&additionalProducts)
}

func DeleteAdditional(c *fiber.Ctx) error {
	additionalID := c.Params("id")

	// Verifique se o item adicional existe no banco de dados
	var existingAdditional models.Additional
	if err := models.DB.First(&existingAdditional, additionalID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Additional item not found"})
	}

	// Antes de excluir o item adicional, exclua todos os relacionamentos na tabela additional_products que o referenciam
	if err := models.DB.Where("additional_id = ?", additionalID).Delete(&models.AdditionalProducts{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete associated relationships"})
	}

	// Agora podemos excluir o item adicional
	if err := models.DB.Delete(&existingAdditional).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete additional item"})
	}

	return c.JSON(fiber.Map{"message": "Additional item deleted successfully"})
}
