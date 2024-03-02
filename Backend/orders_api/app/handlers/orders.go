package handlers

import (
	"context"
	"log"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateOrder(c *fiber.Ctx) error {
	var request dto.RequestPayload

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "",
		})
	}

	collection := models.MongoDabase.Collection("orders")

	insertResult, err := collection.InsertOne(context.Background(), request)
	if err != nil {
		log.Fatal(err)
	}

	return c.JSON(&insertResult)
}

func ListOrdersByestablishmentId(c *fiber.Ctx) error {
	establishmentId := c.Params("establishmentId")

	if establishmentId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do estabelecimento não fornecido",
		})
	}

	collection := models.MongoDabase.Collection("orders")

	filter := bson.M{"establishmentid": establishmentId}

	// Realizar a consulta no banco de dados
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Falha ao buscar pedidos",
		})
	}

	// Iterar sobre os resultados e adicionar a uma slice
	var orders []interface{}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var order interface{}
		if err := cursor.Decode(&order); err != nil {
			log.Fatal(err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Falha ao decodificar resultados",
			})
		}
		orders = append(orders, order)
	}

	return c.JSON(orders)
}
