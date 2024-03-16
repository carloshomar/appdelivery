package handlers

import (
	"context"
	"encoding/json"
	"log"
	"math"
	"strconv"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateSolicitation(msg string) {
	var orderDTO dto.OrderDTO

	err := json.Unmarshal([]byte(msg), &orderDTO)
	if err != nil {
		log.Printf("Erro ao decodificar a mensagem JSON: %s", err)
		return
	}

	collection := models.MongoDabase.Collection("solicitations")

	_, err = collection.InsertOne(context.Background(), &orderDTO)
	if err != nil {
		log.Fatal(err)
	}

}

func GetApprovedSolicitations(c *fiber.Ctx) error {
	// Receber latitude, longitude e limite de distância dos parâmetros da consulta
	lat := c.Query("latitude")
	long := c.Query("longitude")
	limitDistance := c.Query("limitDistance")

	// Converter latitude, longitude e limite de distância para float64
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

	// Definindo um filtro para buscar solicitações com status "APPROVED"
	filter := bson.M{"status": "APPROVED"}

	// Realizando a consulta ao banco de dados
	cur, err := collection.Find(context.Background(), filter)
	if err != nil {
		return err // Retornar erro
	}
	defer cur.Close(context.Background())

	// Iterando sobre os resultados e decodificando cada documento em um DTO
	for cur.Next(context.Background()) {
		var orderDTO dto.OrderDTO
		err := cur.Decode(&orderDTO)
		if err != nil {
			return err // Retornar erro
		}

		// Calcular a distância entre o estabelecimento e as coordenadas fornecidas
		distance := calculateDistance(latitude, longitude, orderDTO.Establishment.Lat, orderDTO.Establishment.Long)

		// Se a distância for menor ou igual ao limite de distância, adiciona a solicitação à lista
		if distance <= limitDist {
			approvedSolicitations = append(approvedSolicitations, orderDTO)
		}
	}

	// Enviar os DTOs aprovados como resposta
	return c.JSON(approvedSolicitations)
}

// Função para calcular a distância entre dois pontos usando a fórmula de Haversine
func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371 // Raio da Terra em quilômetros

	// Converter coordenadas de graus para radianos
	lat1Rad := degreesToRadians(lat1)
	lon1Rad := degreesToRadians(lon1)
	lat2Rad := degreesToRadians(lat2)
	lon2Rad := degreesToRadians(lon2)

	// Calcular diferenças de coordenadas
	deltaLat := lat2Rad - lat1Rad
	deltaLon := lon2Rad - lon1Rad

	// Calcular a distância usando a fórmula de Haversine
	a := math.Pow(math.Sin(deltaLat/2), 2) + math.Cos(lat1Rad)*math.Cos(lat2Rad)*math.Pow(math.Sin(deltaLon/2), 2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	distance := earthRadius * c

	return distance
}

// Função para converter graus em radianos
func degreesToRadians(degrees float64) float64 {
	return degrees * math.Pi / 180
}
