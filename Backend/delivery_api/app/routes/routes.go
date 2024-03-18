package routes

import (
	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/solicitation-orders", handlers.GetApprovedSolicitations)
	app.Put("/solicitation-orders/hand-shake", handlers.HandShakeDeliveryman)

	app.Get("/deliveryman/has-active/:id", handlers.GetOrdersByDeliverymanID)

}
