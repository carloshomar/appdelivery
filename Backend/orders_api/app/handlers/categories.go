package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/carloshomar/vercardapio/app/models"
)

type CategorieRequest struct {
	Id              uint             `json:id`
	Name            string           `json:name`
	Image           string           `json:image`
	EstablishmentId uint             `json:establishmentId`
	Products        []models.Product `json:products`
}

func CreateCategories(c *fiber.Ctx) error {
	var request CategorieRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "",
		})
	}

	categorie := models.Category{
		Name:            request.Name,
		Image:           request.Image,
		EstablishmentID: request.EstablishmentId,
	}

	models.DB.Create(&categorie)
	request.Id = categorie.ID

	return c.JSON(&request)
}

func GetCategories(c *fiber.Ctx) error {
	establishmentId, err := c.ParamsInt("establishmentId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	var categories []models.Category

	models.DB.Where(&models.Category{
		EstablishmentID: uint(establishmentId),
	}).Find(&categories)

	return c.JSON(&categories)
}

func CreateProductCategorie(c *fiber.Ctx) error {
	var request CategoryRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	product := models.CategoryProducts{
		CategoryID: request.CategoryID,
		ProductID:  request.ProductID,
	}

	models.DB.Create(&product)

	return c.JSON(&product)
}

func GetCategoriesWithProducts(c *fiber.Ctx) error {
	establishmentID, err := c.ParamsInt("establishmentId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse establishment ID"})
	}

	var categories []models.Category
	var categoriesWithProducts []CategorieRequest

	models.DB.Where(&models.Category{
		EstablishmentID: uint(establishmentID),
	}).Find(&categories)

	for _, category := range categories {
		var products []models.Product

		// Obtenha os produtos associados à categoria
		models.DB.Model(&category).Preload("Additional").Association("Products").Find(&products)

		// Converte os produtos para o formato de request adequado

		// Adiciona a categoria e os produtos associados à lista final
		categoriesWithProducts = append(categoriesWithProducts,
			CategorieRequest{
				Id:              category.ID,
				Name:            category.Name,
				Image:           category.Image,
				EstablishmentId: category.EstablishmentID,
				Products:        products,
			},
		)
	}

	return c.JSON(&categoriesWithProducts)
}
