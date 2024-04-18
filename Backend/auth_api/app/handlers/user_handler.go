package handlers

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/middlewares"
	"github.com/carloshomar/vercardapio/app/models"
)

func CreateUser(c *fiber.Ctx) error {
	var request dto.CreateUserRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	user := models.User{
		Name:  request.Name,
		Email: request.Email,
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	if err := models.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	establishment := models.Establishment{
		Name:                request.Establishment.Name,
		Description:         request.Establishment.Description,
		OwnerID:             user.ID,
		Image:               request.Establishment.Image,
		PrimaryColor:        request.Establishment.PrimaryColor,
		SecondaryColor:      request.Establishment.SecondaryColor,
		Lat:                 request.Establishment.Lat,
		Long:                request.Establishment.Long,
		MaxDistanceDelivery: request.Establishment.MaxDistanceDelivery,
		LocationString:      request.Establishment.LocationString,
	}

	if err := models.DB.Create(&establishment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create establishment"})
	}

	user.EstablishmentID = establishment.ID
	if err := models.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Generate JWT token
	tokenString, err := middlewares.GenerateJWT(&user, &establishment)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT token"})
	}

	request.Password = ""
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"user": request, "token": tokenString})
}

func Login(c *fiber.Ctx) error {
	var request dto.LoginRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	var user models.User
	models.DB.Where(&models.User{
		Email: request.Email,
	}).First(&user)

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Incorrect credentials"})
	}

	var establishment models.Establishment
	models.DB.Where(&models.Establishment{
		ID: user.EstablishmentID,
	}).First(&establishment)

	tokenString, jwtError := middlewares.GenerateJWT(&user, &establishment)

	if jwtError != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Incorrect credentials"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func GetUser(c *fiber.Ctx) error {

	userID := c.Params("id")
	var user models.User

	models.DB.First(&user, userID)

	return c.JSON(user)
}
