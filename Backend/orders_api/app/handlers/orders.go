package handlers

import (
	"context"
	"log"
	"net/url"
	"strconv"

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

func ListOrdersByEstablishmentID(c *fiber.Ctx) error {
	establishmentID := c.Params("establishmentId")

	if establishmentID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do estabelecimento não fornecido",
		})
	}

	establishmentIDInt, err := strconv.Atoi(establishmentID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do estabelecimento inválido",
		})
	}

	filter := bson.M{"establishmentid": establishmentIDInt}

	collection := models.MongoDabase.Collection("orders")

	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Falha ao buscar pedidos",
		})
	}
	defer cursor.Close(context.Background())

	// Decodificar todos os resultados em uma slice
	var orders []map[string]interface{}
	if err := cursor.All(context.Background(), &orders); err != nil {
		log.Fatal(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Falha ao decodificar resultados",
		})
	}

	// Formatar cada objeto individualmente
	var formattedOrders []map[string]interface{}
	for _, order := range orders {
		formattedOrder := make(map[string]interface{})
		for key, value := range order {
			formattedOrder[key] = value
		}
		formattedOrders = append(formattedOrders, formattedOrder)
	}

	return c.JSON(formattedOrders)
}

func ListOrdersByEstablishmentIDAndPhone(c *fiber.Ctx) error {
	establishmentID := c.Params("establishmentId")
	phoneNumberEncoded := c.Params("phoneNumber")

	if establishmentID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID do estabelecimento não fornecido"})
	}

	establishmentIDInt, err := strconv.Atoi(establishmentID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID do estabelecimento inválido"})
	}

	phoneNumber, err := url.QueryUnescape(phoneNumberEncoded)
	filter := bson.M{
		"establishmentid": establishmentIDInt,
		"user.phone":      phoneNumber,
	}

	collection := models.MongoDabase.Collection("orders")
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao buscar pedidos"})
	}
	defer cursor.Close(context.Background())

	var orders []map[string]interface{}
	if err := cursor.All(context.Background(), &orders); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao decodificar resultados"})
	}

	// Não é necessário formatar, podemos retornar os resultados diretamente
	return c.JSON(orders)
}

func ListOrdersByPhone(c *fiber.Ctx) error {
	phoneNumberEncoded := c.Params("phoneNumber")

	phoneNumber, err := url.QueryUnescape(phoneNumberEncoded)
	filter := bson.M{
		"user.phone": phoneNumber,
	}

	collection := models.MongoDabase.Collection("orders")
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao buscar pedidos"})
	}
	defer cursor.Close(context.Background())

	var orders []map[string]interface{}
	if err := cursor.All(context.Background(), &orders); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao decodificar resultados"})
	}

	// Não é necessário formatar, podemos retornar os resultados diretamente
	return c.JSON(orders)
}
