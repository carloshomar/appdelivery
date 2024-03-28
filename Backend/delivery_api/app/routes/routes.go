package routes

import (
	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, sendMessageToClient func(clientID int64, message []byte) error) {
	app.Get("/solicitation-orders", handlers.GetApprovedSolicitations)
	app.Put("/solicitation-orders/hand-shake", handlers.HandShakeDeliveryman)

	app.Get("/deliveryman/has-active/:id", handlers.GetOrdersByDeliverymanID)

	app.Post("/deliveryman/status", func(c *fiber.Ctx) error {
		return handlers.UpdateOrderStatusByDeliverymanID(c, sendMessageToClient)
	})
}
