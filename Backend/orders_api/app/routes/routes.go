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
	app.Delete("/products/delete/:id", handlers.DeleteProduct)
	app.Post("/products/multi-create", handlers.CreateMultProducts)
	app.Put("/products/update/:id", handlers.UpdateProduct)

	app.Post("/categories/create", handlers.CreateCategories)
	app.Get("/categories/:establishmentId", handlers.GetCategories)

	app.Post("/categories/product", handlers.CreateProductCategorie)
	app.Delete("/categories/:id", handlers.DeleteCategory)
	app.Put("/categories/:id", handlers.UpdateCategory)

	app.Get("/categories/product/:establishmentId", handlers.GetCategoriesWithProducts)

	app.Post("/additional", handlers.CreateAdditional)

	app.Get("/additional/:id", handlers.ListAdditional)
	app.Put("/additional/:id", handlers.UpdateAdditional)
	app.Delete("/additional/:id", handlers.DeleteAdditional)
	app.Post("/additional/product", handlers.CreateProductToAdditional)

	app.Post("/delivery", handlers.InsertDelivery)
	app.Post("/delivery/calculate-delivery-value", handlers.CalculateDeliveryValue)
	app.Get("/delivery/value/:establishmentId", handlers.GetDeliveryByEstablishmentID)


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
