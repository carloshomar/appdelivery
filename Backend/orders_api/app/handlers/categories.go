package handlers

import (
	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func CreateCategories(c *fiber.Ctx) error {
	var request dto.CategorieRequest

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
	var request dto.CategoryRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Verificar se o relacionamento já existe
	var existingCategoryProduct models.CategoryProducts
	result := models.DB.Where(&models.CategoryProducts{
		CategoryID: request.CategoryID,
		ProductID:  request.ProductID,
	}).First(&existingCategoryProduct)

	if result.RowsAffected > 0 {
		// O relacionamento já existe, então deve removê-lo
		models.DB.Where(&models.CategoryProducts{
			CategoryID: request.CategoryID,
			ProductID:  request.ProductID,
		}).Delete(&existingCategoryProduct)
		return c.JSON(&existingCategoryProduct)

	}

	categoryProduct := models.CategoryProducts{
		CategoryID: request.CategoryID,
		ProductID:  request.ProductID,
	}

	models.DB.Create(&categoryProduct)

	return c.JSON(&categoryProduct)
}

func GetCategoriesWithProducts(c *fiber.Ctx) error {
	establishmentID, err := c.ParamsInt("establishmentId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse establishment ID"})
	}

	var categories []models.Category
	var categoriesWithProducts []dto.CategorieRequest

	models.DB.Where(&models.Category{
		EstablishmentID: uint(establishmentID),
	}).Find(&categories)

	for _, category := range categories {
		var products []models.Product

		models.DB.Model(&category).Preload("Additional").Association("Products").Find(&products)

		// Adiciona a categoria e os produtos associados à lista final
		categoriesWithProducts = append(categoriesWithProducts,
			dto.CategorieRequest{
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

func DeleteCategory(c *fiber.Ctx) error {
	categoryID := c.Params("id")

	var existingCategory models.Category
	if err := models.DB.First(&existingCategory, categoryID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	if err := models.DB.Where("category_id = ?", categoryID).Delete(&models.CategoryProducts{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete associated relationships"})
	}

	if err := models.DB.Delete(&existingCategory).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete category"})
	}

	return c.JSON(fiber.Map{"message": "Category deleted successfully"})
}

func UpdateCategory(c *fiber.Ctx) error {
	var request dto.CategorieRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	categoryID := c.Params("id")

	var existingCategory models.Category
	if err := models.DB.First(&existingCategory, categoryID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	existingCategory.Name = request.Name
	existingCategory.Image = request.Image

	if err := models.DB.Save(&existingCategory).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update category"})
	}

	return c.JSON(&existingCategory)
}
