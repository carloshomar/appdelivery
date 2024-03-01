package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/carloshomar/vercardapio/app/handlers"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/ping", handlers.Ping)
	app.Get("/products/:establishmentId", handlers.GetByEstablishmentId)
	app.Get("/products/all/:establishmentId", handlers.GetByEstablishmentIdWithRelations)

	app.Post("/products/create", handlers.CreateProduct)
	app.Post("/products/multi-create", handlers.CreateMultProducts)

	app.Post("/categories/create", handlers.CreateCategories)
	app.Get("/categories/:establishmentId", handlers.GetCategories)

	app.Post("/categories/product", handlers.CreateProductCategorie)
	app.Get("/categories/product/:establishmentId", handlers.GetCategoriesWithProducts)

	app.Post("/additional", handlers.CreateAdditional)
	app.Post("/additional/product", handlers.CreateProductToAdditional)

	app.Post("/delivery/calculate-delivery-value", handlers.CalculateDeliveryValue)
	app.Post("/delivery", handlers.InsertDelivery)

}
