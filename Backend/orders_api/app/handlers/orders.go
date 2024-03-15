package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/url"
	"strconv"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateOrder(c *fiber.Ctx) error {
	var request dto.RequestPayload

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	// Definir o status padrão
	request.Status = "AWAIT_APROVE"

	collection := models.MongoDabase.Collection("orders")

	insertResult, err := collection.InsertOne(context.Background(), request)
	if err != nil {
		log.Fatal(err)
	}

	return c.JSON(&insertResult)
}

func UpdateOrderStatus(c *fiber.Ctx) error {
	var requestBody dto.UpdateOrderStatusRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	orderID, err := primitive.ObjectIDFromHex(requestBody.ID)
	filter := bson.M{"_id": orderID}

	collection := models.MongoDabase.Collection("orders")

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID inválido",
		})
	}

	if requestBody.Status == "APPROVED" {
		var order dto.RequestPayload
		collection.FindOne(context.Background(), filter).Decode(&order)
		orderBytes, _ := json.Marshal(&order)
		PublishMessage(orderBytes)
	}

	update := bson.M{
		"$set": bson.M{
			"status": requestBody.Status,
		},
		"$currentDate": bson.M{
			"lastModified": true,
		},
	}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	// Verificar se algum documento foi atualizado
	if updateResult.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Nenhum pedido encontrado com o ID fornecido",
		})
	}

	// Retornar resposta de sucesso
	return c.JSON(fiber.Map{
		"message": "Status do pedido atualizado com sucesso",
	})
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
	phoneNumberEncoded := c.Params("phone")

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
