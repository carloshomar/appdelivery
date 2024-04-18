package handlers

import (
	"context"
	"log"
	"strconv"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetExtrato(c *fiber.Ctx) error {
	deliverymanIDStr := c.Params("id")
	deliverymanID, err := strconv.ParseInt(deliverymanIDStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID de deliveryman inválido",
		})
	}

	collection := models.MongoDabase.Collection("solicitations")

	// Definir o filtro para encontrar os pedidos com base no ID do deliveryman, status e deliveryman.status igual a "FINISHED"
	filter := bson.M{
		"deliveryman.id":     deliverymanID,
		"status":             "FINISHED",
		"deliveryman.status": "FINISHED",
	}

	options := options.Find()
	options.SetSort(bson.D{{"operationDate", -1}})

	cursor, err := collection.Find(context.Background(), filter, options)
	if err != nil {
		log.Printf("Erro ao consultar os pedidos: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao consultar os pedidos",
		})
	}
	defer cursor.Close(context.Background())

	var orders []dto.OrderDTO
	for cursor.Next(context.Background()) {
		var order dto.OrderDTO
		if err := cursor.Decode(&order); err != nil {
			log.Printf("Erro ao decodificar o pedido: %s", err)
			continue
		}
		orders = append(orders, order)
	}

	if err := cursor.Err(); err != nil {
		log.Printf("Erro ao iterar sobre os resultados: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao consultar os pedidos",
		})
	}

	return c.JSON(orders)
}
