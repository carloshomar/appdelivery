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
	}).Preload("Additional").Find(&product).Preload("Categories").Find(&product)

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

func UpdateProduct(c *fiber.Ctx) error {

	var request dto.ProductRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	productID := c.Params("id")
	if productID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product ID is required"})
	}

	var existingProduct models.Product
	if err := models.DB.Where("id = ?", productID).First(&existingProduct).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	existingProduct.Name = request.Name
	existingProduct.Description = request.Description
	existingProduct.Price = request.Price
	existingProduct.Image = request.Image

	if err := models.DB.Save(&existingProduct).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product"})
	}

	return c.JSON(existingProduct)
}

func CreateMultProducts(c *fiber.Ctx) error {
	var requests []dto.ProductRequest
	if err := c.BodyParser(&requests); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

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
