package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func gerarHex(n int) (string, error) {
	bytes := make([]byte, n)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func CreateDeliveryOrder(c *fiber.Ctx, sendMessageToClient func(clientID int64, message []byte) error) error {
	var request dto.RequestPayload

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	/// Diferentemente do createOrder padrão que precisa da aceitação do restaunrate.
	/// Na entrega avulsa você consegue solicitar só a parte de entrega, se restaurantes.
	request.Status = "DONE"

	collection := models.MongoDabase.Collection("orders")

	insertResult, err := collection.InsertOne(context.Background(), request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao inserir a ordem no banco de dados",
		})
	}

	if oid, ok := insertResult.InsertedID.(primitive.ObjectID); ok {
		request.OrderId = oid.Hex()
	}

	jsonData, _ := json.Marshal(request)

	if err := sendMessageToClient(0, jsonData); err != nil {
		return err
	}

	requestBytes, _ := json.Marshal(&request)

	err = PublishMessage(requestBytes)
	if err != nil {
		log.Println(err)
	}

	return c.JSON(fiber.Map{
		"message": "Ordem criada com sucesso",
		"orderId": insertResult.InsertedID,
	})

}

// Esse método não publica na fila do delivery, pois ele precisa de aprovação do estabelecimento.
func CreateOrder(c *fiber.Ctx, sendMessageToClient func(clientID int64, message []byte) error) error {
	var request dto.RequestPayload

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	request.Status = "AWAIT_APPROVE"

	establishment, err := GetEstablishment(request.EstablishmentId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao obter detalhes do estabelecimento",
		})
	}

	request.Establishment = *establishment

	collection := models.MongoDabase.Collection("orders")

	insertResult, err := collection.InsertOne(context.Background(), request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao inserir a ordem no banco de dados",
		})
	}

	jsonData, _ := json.Marshal(request)
	if err := sendMessageToClient(request.EstablishmentId, jsonData); err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Ordem criada com sucesso",
		"orderId": insertResult.InsertedID,
	})
}

func GetEstablishment(establishmentID int64) (*dto.Establishment, error) {
	urlEnv := os.Getenv("URL_GET_ESTABLISHMENT_ID")
	if urlEnv == "" {
		panic("URL_GET_ESTABLISHMENT_ID não configurado.")
	}

	url := fmt.Sprintf(urlEnv, establishmentID)
	log.Println(url)
	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API retornou status não OK: %d", response.StatusCode)
	}

	var establishmentDTO dto.Establishment
	if err := json.NewDecoder(response.Body).Decode(&establishmentDTO); err != nil {
		return nil, err
	}

	return &establishmentDTO, nil
}

func UpdateOrderStatus(c *fiber.Ctx, sendMessageToClient func(clientID int64, message []byte) error) error {
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

	var order dto.RequestPayload
	_ = collection.FindOne(context.Background(), filter).Decode(&order)
	if requestBody.Status != "REQUEST_APPROVE" {
		order.OrderId = orderID.Hex()
		order.Status = requestBody.Status
		orderBytes, err := json.Marshal(&order)
		if err == nil {
			_ = PublishMessage(orderBytes)
		}
	}

	jsonData, _ := json.Marshal(requestBody)

	if err := sendMessageToClient(order.EstablishmentId, jsonData); err != nil {
		return err
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

	if updateResult.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Nenhum pedido encontrado com o ID fornecido",
		})
	}

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

	var orders []map[string]interface{}
	if err := cursor.All(context.Background(), &orders); err != nil {
		log.Fatal(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Falha ao decodificar resultados",
		})
	}

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

	phoneNumber, _ := url.QueryUnescape(phoneNumberEncoded)
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

	return c.JSON(orders)
}

func ListOrdersByPhone(c *fiber.Ctx) error {
	phoneNumberEncoded := c.Params("phone")

	phoneNumber, err := url.QueryUnescape(phoneNumberEncoded)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao decodificar número de telefone"})
	}

	filter := bson.M{
		"user.phone": phoneNumber,
	}

	collection := models.MongoDabase.Collection("orders")
	options := options.Find().SetSort(bson.D{{"lastModified", -1}})
	cursor, err := collection.Find(context.Background(), filter, options)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao buscar pedidos"})
	}
	defer cursor.Close(context.Background())

	var orders []map[string]interface{}
	if err := cursor.All(context.Background(), &orders); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao decodificar resultados"})
	}

	return c.JSON(orders)
}
