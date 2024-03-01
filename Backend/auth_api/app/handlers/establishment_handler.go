package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/carloshomar/vercardapio/app/models"
)

func GetEstablishments(c *fiber.Ctx) error {
	establishmentId := c.Params("id")

	var establishment models.Establishment
	models.DB.First(&establishment, establishmentId)
	return c.JSON(establishment)
}

func ListEstablishments(c *fiber.Ctx) error {
	var establishment []models.Establishment
	models.DB.Find(&establishment)
	return c.JSON(establishment)
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
