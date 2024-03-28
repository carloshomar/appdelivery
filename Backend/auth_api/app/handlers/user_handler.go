package handlers

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/middlewares"
	"github.com/carloshomar/vercardapio/app/models"
)

func CreateUser(c *fiber.Ctx) error {
	// Parse the request body to obtain user data
	var request dto.CreateUserRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Create the user with the request data
	user := models.User{
		Name:  request.Name,
		Email: request.Email,
	}

	// Generate the password hash using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	// Insert the user into the database
	if err := models.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Create the establishment with the request data
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

	// Insert the establishment into the database
	if err := models.DB.Create(&establishment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create establishment"})
	}

	// Update the user with the establishment ID
	user.EstablishmentID = establishment.ID
	if err := models.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Generate JWT token
	tokenString, err := middlewares.GenerateJWT(&user, &establishment)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT token"})
	}

	// Return the response with user data and token
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

	// Compare a senha fornecida com o hash salvo no banco de dados
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
	// Lógica para obter usuário por ID
	userID := c.Params("id")
	var user models.User

	// Consulte o usuário no banco de dados por ID
	models.DB.First(&user, userID)

	// Retorne o usuário em formato JSON
	return c.JSON(user)
}
