package middlewares

import (
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/carloshomar/vercardapio/app/models"
)

func ValidateJWT(c *fiber.Ctx) (*jwt.Token, error) {
	tokenString := c.Get("Authorization")
	if len(tokenString) > 7 {
		tokenString = tokenString[7:]
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		log.Printf("Error parsing token: %v", err)
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
	}

	// Verifique a expiração do token manualmente
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		expirationTime := time.Unix(int64(claims["exp"].(float64)), 0)
		expirationNow := time.Now()
		if expirationNow.After(expirationTime) {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Token is expired (manual check)")
		}
	} else {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token claims")
	}

	return token, nil
}

func GenerateJWT(user *models.User, establishment *models.Establishment) (string, error) {
	// Defina a expiração para 7 dias a partir de agora (hora UTC)
	expirationTime := time.Now().UTC().Add(time.Hour * 24 * 7).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":            user.ID,
		"name":          user.Name,
		"email":         user.Email,
		"establishment": establishment,
		"exp":           expirationTime,
	})

	// Assine o token com a chave secreta
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
