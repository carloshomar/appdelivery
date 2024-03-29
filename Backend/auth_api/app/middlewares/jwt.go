package middlewares

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func ValidateJWT(c *fiber.Ctx) (*jwt.Token, error) {
	tokenString := c.Get("Authorization")
	if len(tokenString) > 7 {
		tokenString = tokenString[7:]
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		log.Printf("Error parsing token: %v", err)
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
	}

	if token.Valid {
		return token, nil
	}

	return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
}

func GenerateJWT(user *models.User, establishment *models.Establishment) (string, error) {
	// Defina a expiração para 7 dias a partir de agora (hora UTC)
	expirationTime := time.Now().UTC().Add(time.Hour * 24 * 7).Unix()

	// Defina as reivindicações do token
	claims := jwt.MapClaims{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"exp":   expirationTime,
	}

	// Se establishment não for nulo, inclua seus campos relevantes nas reivindicações
	if establishment != nil {
		claims["establishment_id"] = establishment.ID
		claims["establishment_name"] = establishment.Name
		// Adicione outros campos relevantes conforme necessário
	}

	// Crie um novo token JWT com as reivindicações definidas
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Assine o token com a chave secreta
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func GenerateJWTDeliveryMan(user *models.DeliveryMan) (string, error) {
	// Defina a expiração para 7 dias a partir de agora (hora UTC)
	expirationTime := time.Now().UTC().Add(time.Hour * 24 * 7).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"exp":   expirationTime,
	})

	// Assine o token com a chave secreta
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
