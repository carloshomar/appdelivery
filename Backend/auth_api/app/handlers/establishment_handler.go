package handlers

import (
	"time"

	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
)

func GetEstablishments(c *fiber.Ctx) error {
	establishmentId := c.Params("id")

	var establishment models.Establishment
	models.DB.First(&establishment, establishmentId)
	return c.JSON(establishment)
}
func ListEstablishments(c *fiber.Ctx) error {
	var establishments []models.Establishment
	models.DB.Where("open_data IS NOT NULL").Find(&establishments)
	return c.JSON(establishments)
}

func GetUserByEstablishment(c *fiber.Ctx) error {
	// Lógica para obter usuário por ID
	establishmentId, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "id not found"})
	}
	var user []models.User

	// Consulte o usuário no banco de dados por ID
	models.DB.Select("name", "email", "id", "establishment_id").Where(&models.User{
		EstablishmentID: uint(establishmentId),
	}).Find(&user)

	// Retorne o usuário em formato JSON
	return c.JSON(user)
}

func HandlerEstablishmentStatus(c *fiber.Ctx) error {
	establishmentID := c.Params("id")

	var establishment models.Establishment
	if err := models.DB.First(&establishment, establishmentID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Establishment not found"})
	}

	if establishment.OpenData != nil {
		establishment.OpenData = nil
	} else {
		currentTime := time.Now()
		currentTimeString := currentTime.Format(time.RFC3339)
		establishment.OpenData = &currentTimeString
	}

	if err := models.DB.Save(&establishment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update establishment status"})
	}

	return c.JSON(establishment)
}
