package routes

import (
	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/carloshomar/vercardapio/app/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/users/register", handlers.CreateUser)
	app.Post("/users/login", handlers.Login)
	app.Get("/establishments", handlers.ListEstablishments)

	app.Get("/users/:id", ProtectedRoute, handlers.GetUser)
	app.Get("/establishments/:id", ProtectedRoute, handlers.GetEstablishments)
	app.Get("/establishments/:id/users", ProtectedRoute, handlers.GetUserByEstablishment)

}

func ProtectedRoute(c *fiber.Ctx) error {
	// Valide o token JWT e obtenha informações do usuário
	_, err := middlewares.ValidateJWT(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Realize a lógica protegida aqui, por exemplo, retornar informações do usuário
	return c.Next()
}
