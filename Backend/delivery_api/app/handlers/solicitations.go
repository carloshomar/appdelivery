package handlers

import (
	"context"
	"encoding/json"
	"log"
	"math"
	"strconv"
	"time"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateSolicitation(msg string, sendMessageToClient func(clientID int64, message []byte) error) error {
	var orderDTO dto.OrderDTO


	err := json.Unmarshal([]byte(msg), &orderDTO)
	if err != nil {
		log.Printf("Erro ao decodificar a mensagem JSON: %s", err)
		return nil
	}

	collection := models.MongoDabase.Collection("solicitations")

	filter := bson.M{"orderid": orderDTO.OrderId}

	existingSolicitation := collection.FindOne(context.Background(), filter)
	if existingSolicitation.Err() != nil {
		if existingSolicitation.Err() != mongo.ErrNoDocuments {
			log.Printf("Erro ao buscar a solicitação existente: %s", existingSolicitation.Err())
			return nil
		}
	} else {
		update := bson.M{"$set": bson.M{"status": orderDTO.Status, "operationDate": time.Now()}}

		log.Printf("Atualizando pedido %s", orderDTO.OrderId)
		log.Printf("Para Status: %s", orderDTO.Status)

		_, err := collection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			log.Printf("Erro ao atualizar a solicitação: %s", err)
			return nil
		}

		var solicitationExistent dto.OrderDTO
		existingSolicitation.Decode(&solicitationExistent)
		orderDTO.DeliveryMan = solicitationExistent.DeliveryMan

		jsonData, _ := json.Marshal(&orderDTO)
		sendMessageToClient(orderDTO.DeliveryMan.Id, jsonData)

		return nil
	}

	_, err = collection.InsertOne(context.Background(), &orderDTO)
	if err != nil {
		log.Fatal(err)
	}
	return nil
}

func HandShakeDeliveryman(c *fiber.Ctx) error {
	var orderDTO dto.OrderDTO
	if err := c.BodyParser(&orderDTO); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Erro ao fazer parsing do corpo da requisição",
		})
	}

	collection := models.MongoDabase.Collection("solicitations")

	filter := bson.M{"orderid": orderDTO.OrderId}

	var existingOrder dto.OrderDTO
	err := collection.FindOne(context.Background(), filter).Decode(&existingOrder)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Pedido não encontrado",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao consultar o pedido",
		})
	}

	if existingOrder.DeliveryMan != (dto.DeliveryMan{}) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "O deliveryman já foi atribuído a este pedido",
		})
	}

	orderDTO.DeliveryMan.Status = "IN_ROUTE_COLECT"
	existingOrder.DeliveryMan = orderDTO.DeliveryMan

	update := bson.M{"$set": bson.M{"deliveryman": existingOrder.DeliveryMan}}

	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Erro ao atualizar a solicitação",
		})
	}

	order, _ := GetOrderByID(orderDTO.OrderId)
	orderBytes, _ := json.Marshal(order)

	PublishMessage(orderBytes)

	return c.JSON(fiber.Map{
		"message": "Pedido atualizado com sucesso",
	})
}

func GetApprovedSolicitations(c *fiber.Ctx) error {
	lat := c.Query("latitude")
	long := c.Query("longitude")
	limitDistance := c.Query("limitDistance")

	latitude, err := strconv.ParseFloat(lat, 64)
	if err != nil {
		return err
	}

	longitude, err := strconv.ParseFloat(long, 64)
	if err != nil {
		return err
	}

	limitDist, err := strconv.ParseFloat(limitDistance, 64)
	if err != nil {
		return err
	}

	var approvedSolicitations []dto.OrderDTO

	collection := models.MongoDabase.Collection("solicitations")

	filter := bson.M{
		"status": bson.M{"$in": []string{"APPROVED", "DONE"}},
		"$or": []bson.M{
			{"deliveryman": nil},
			{"deliveryman.id": 0},
		},
	}

	cur, err := collection.Find(context.Background(), filter)
	if err != nil {
		return err
	}
	defer cur.Close(context.Background())

	for cur.Next(context.Background()) {
		var orderDTO dto.OrderDTO
		err := cur.Decode(&orderDTO)
		if err != nil {
			return err
		}

		// Calcular a distância entre o estabelecimento e as coordenadas fornecidas
		distance := calculateDistance(latitude, longitude, orderDTO.Establishment.Lat, orderDTO.Establishment.Long)

		// Se a distância for menor ou igual ao limite de distância, adiciona a solicitação à lista
		if distance <= limitDist {
			approvedSolicitations = append(approvedSolicitations, orderDTO)
		}
	}

	return c.JSON(approvedSolicitations)
}

// Função para calcular a distância entre dois pontos usando a fórmula de Haversine (https://pt.wikipedia.org/wiki/F%C3%B3rmula_de_haversine)
func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371 // Raio da Terra em quilômetros

	// Converte as coordenadas de graus para radianos
	lat1Rad := degreesToRadians(lat1)
	lon1Rad := degreesToRadians(lon1)
	lat2Rad := degreesToRadians(lat2)
	lon2Rad := degreesToRadians(lon2)

	// Calcula as diferenças de coordenadas
	deltaLat := lat2Rad - lat1Rad
	deltaLon := lon2Rad - lon1Rad

	// Calcula as distância usando a fórmula de Haversine
	a := math.Pow(math.Sin(deltaLat/2), 2) + math.Cos(lat1Rad)*math.Cos(lat2Rad)*math.Pow(math.Sin(deltaLon/2), 2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	distance := earthRadius * c

	return distance
}

// Função para converter graus em radianos
func degreesToRadians(degrees float64) float64 {
	return degrees * math.Pi / 180
}
