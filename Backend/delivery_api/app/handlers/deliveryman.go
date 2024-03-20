package handlers

import (
	"context"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
)

func GetOrdersByDeliverymanID(c *fiber.Ctx) error {

	deliverymanIDStr := c.Params("id")
	deliverymanID, err := strconv.ParseInt(deliverymanIDStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID de deliveryman inválido",
		})
	}

	collection := models.MongoDabase.Collection("solicitations")

	// Definir o filtro para encontrar os pedidos com base no ID do deliveryman e no status diferente de "FINISHED"
	filter := bson.M{
		"deliveryman.id": deliverymanID,
		"status": bson.M{
			"$ne": "FINISHED",
		},
	}

	// Consultar o banco de dados para obter os pedidos
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Printf("Erro ao consultar os pedidos: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao consultar os pedidos",
		})
	}
	defer cursor.Close(context.Background())

	// Iterar sobre os resultados e adicionar os pedidos a uma slice
	var orders []dto.OrderDTO
	for cursor.Next(context.Background()) {
		var order dto.OrderDTO
		if err := cursor.Decode(&order); err != nil {
			log.Printf("Erro ao decodificar o pedido: %s", err)
			continue
		}
		orders = append(orders, order)
	}

	// Verificar se houve algum erro durante a iteração
	if err := cursor.Err(); err != nil {
		log.Printf("Erro ao iterar sobre os resultados: %s", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao consultar os pedidos",
		})
	}

	return c.JSON(orders)
}

func UpdateOrderStatusByDeliverymanID(c *fiber.Ctx) error {

	var request struct {
		OrderID     string `json:"order_id"`
		Deliveryman struct {
			Id     int64  `json:"id"`
			Status string `json:"status"`
		} `json:"deliveryman"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	collection := models.MongoDabase.Collection("solicitations")

	// Definir o filtro para encontrar o pedido com base no ID do pedido e no ID do entregador
	filter := bson.M{
		"orderid":        request.OrderID,
		"deliveryman.id": request.Deliveryman.Id, // Adicionar verificação do ID do entregador
	}

	// Definir os dados de atualização para o status do entregador
	update := bson.M{"$set": bson.M{"deliveryman.status": request.Deliveryman.Status}}

	// Executar a operação de atualização no banco de dados
	_, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao atualizar o status do pedido",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Status do pedido atualizado com sucesso",
	})
}
