package handlers

import (
	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func Ping(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{})
}

func GetByEstablishmentId(c *fiber.Ctx) error {
	establishmentId, err := c.ParamsInt("establishmentId")

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	var product []models.Product

	models.DB.Where(&models.Product{
		EstablishmentID: uint(establishmentId),
	}).Preload("Additional").Find(&product)

	return c.JSON(&product)
}

func CreateProduct(c *fiber.Ctx) error {
	var request dto.ProductRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	product := models.Product{
		Name:            request.Name,
		Description:     request.Description,
		Price:           request.Price,
		Image:           request.Image,
		EstablishmentID: uint(request.EstablishmentID),
	}
	models.DB.Create(&product)

	return c.JSON(&product)
}

func CreateMultProducts(c *fiber.Ctx) error {
	var requests []dto.ProductRequest
	if err := c.BodyParser(&requests); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Criar uma slice para armazenar os produtos criados
	var createdProducts []models.Product

	// Iterar sobre os pedidos e criar produtos individualmente
	for _, request := range requests {
		// Verificar se o estabelecimento existe (se necessário)
		// Isso depende dos requisitos do seu aplicativo

		product := models.Product{
			Name:            request.Name,
			Description:     request.Description,
			Price:           request.Price,
			Image:           request.Image,
			EstablishmentID: uint(request.EstablishmentID),
		}

		// Criar o produto e adicionar à slice de produtos criados
		models.DB.Create(&product)
		createdProducts = append(createdProducts, product)
	}

	return c.JSON(&createdProducts)
}

func CreateAdditional(c *fiber.Ctx) error {
	var request dto.AdditionalRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	additional := models.Additional{
		Name:        request.Name,
		Price:       request.Price,
		Image:       request.Image,
		Description: request.Description,
	}

	models.DB.Create(&additional)

	return c.JSON(&additional)
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
		// O relacionamento já existe, retorne um erro ou trate conforme necessário
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Relationship already exists"})
	}

	// O produto existe, e o relacionamento não existe, agora podemos criar o AdditionalProducts
	additionalProducts := models.AdditionalProducts{
		ProductID:    request.ProductID,
		AdditionalID: request.AdditionalID,
	}

	models.DB.Create(&additionalProducts)

	return c.JSON(&additionalProducts)
}

func GetByEstablishmentIdWithRelations(c *fiber.Ctx) error {
	establishmentId, err := c.ParamsInt("establishmentId")

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	var categories []models.Category
	var categoriesWithProducts []models.CategoryProducts

	models.DB.Where(&models.Category{
		EstablishmentID: uint(establishmentId),
	}).Find(&categories)

	for _, category := range categories {
		var products []models.Product

		models.DB.Model(&category).Association("Products").Find(&products)

		categoriesWithProducts = append(categoriesWithProducts, models.CategoryProducts{
			Category: category,
		})

	}

	return c.JSON(&categories)
}
