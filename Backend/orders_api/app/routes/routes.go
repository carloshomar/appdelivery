package routes

import (
	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, sendMessageToClient func(clientID int64, message []byte) error) {
	app.Get("/ping", handlers.Ping)
	app.Get("/products/all/:establishmentId", handlers.GetByEstablishmentIdWithRelations)
	app.Get("/products/:establishmentId", handlers.GetByEstablishmentId)

	app.Post("/products/create", handlers.CreateProduct)
	app.Post("/products/multi-create", handlers.CreateMultProducts)
	app.Put("/products/update/:id", handlers.UpdateProduct)

	app.Post("/categories/create", handlers.CreateCategories)
	app.Get("/categories/:establishmentId", handlers.GetCategories)

	app.Post("/categories/product", handlers.CreateProductCategorie)
	app.Get("/categories/product/:establishmentId", handlers.GetCategoriesWithProducts)

	app.Get("/additional/:id", handlers.ListAdditional)
	app.Post("/additional", handlers.CreateAdditional)
	app.Put("/additional/:id", handlers.UpdateAdditional)
	app.Post("/additional/product", handlers.CreateProductToAdditional)

	app.Post("/delivery", handlers.InsertDelivery)
	app.Post("/delivery/calculate-delivery-value", handlers.CalculateDeliveryValue)

	app.Post("/orders", func(c *fiber.Ctx) error {
		return handlers.CreateOrder(c, sendMessageToClient)
	})

	app.Put("/orders/status", func(c *fiber.Ctx) error {
		return handlers.UpdateOrderStatus(c, sendMessageToClient)
	})

	app.Get("/orders/list-phone/:phone", handlers.ListOrdersByPhone)
	app.Get("/orders/:establishmentId", handlers.ListOrdersByEstablishmentID)
	app.Get("/orders/:establishmentId/:phoneNumber", handlers.ListOrdersByEstablishmentIDAndPhone)

}
