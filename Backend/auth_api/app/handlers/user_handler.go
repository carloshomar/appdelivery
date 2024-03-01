package handlers

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"github.com/carloshomar/vercardapio/app/middlewares"
	"github.com/carloshomar/vercardapio/app/models"
)

type CreateUserRequest struct {
	Id            int                  `json:"id"`
	Name          string               `json:"name"`
	Email         string               `json:"email"`
	Password      string               `json:"password"`
	Establishment EstablishmentRequest `json:"establishment"`
}

type EstablishmentRequest struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	Image          string `json:image`
	PrimaryColor   string `json:"primary_color"`
	SecondaryColor string `json:"secodary_color"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateUser(c *fiber.Ctx) error {
	// Parse o corpo da requisição para obter os dados do usuário
	var request CreateUserRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Crie o usuário com os dados da requisição
	user := models.User{
		Name:  request.Name,
		Email: request.Email,
	}

	// Gere o hash da senha usando bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	// Insira o usuário no banco de dados
	models.DB.Create(&user)

	// Crie o estabelecimento com os dados da requisição
	establishment := models.Establishment{
		Name:           request.Establishment.Name,
		Description:    request.Establishment.Description,
		OwnerID:        user.ID,
		Image:          request.Establishment.Image,
		PrimaryColor:   request.Establishment.PrimaryColor,
		SecondaryColor: request.Establishment.SecondaryColor,
	}

	// Insira o estabelecimento no banco de dados
	models.DB.Create(&establishment)

	// Alterando o id do estabelecimento do usuário criado.
	user.EstablishmentID = establishment.ID
	request.Id = int(user.ID)
	request.Establishment.Id = int(establishment.ID)
	models.DB.Save(&user)

	tokenString, err := middlewares.GenerateJWT(&user, &establishment)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate JWT token"})
	}

	// Retorne o exemplo do corpo da requisição em formato JSON
	request.Password = ""
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"user": request, "token": tokenString})
}

func Login(c *fiber.Ctx) error {
	var request LoginRequest
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
