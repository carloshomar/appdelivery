package handlers

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/carloshomar/vercardapio/app/dto"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ReceiveMessage(msg string, sendMessageToClient func(clientID int64, message []byte) error) {
	var orderMsg dto.RequestPayload

	err := json.Unmarshal([]byte(msg), &orderMsg)
	if err != nil {
		log.Printf("Erro ao decodificar a mensagem JSON: %s", err)
	}

	collection := models.MongoDabase.Collection("orders")

	orderID, err := primitive.ObjectIDFromHex(orderMsg.OrderId)
	if err != nil {
		log.Printf("Erro ao converter o ID para ObjectID: %s", err)
	}

	filter := bson.M{"_id": orderID}

	update := bson.M{
		"$set": bson.M{
			"deliveryman":  orderMsg.DeliveryMan,
			"lastModified": time.Now(),
		},
	}

	if orderMsg.DeliveryMan.Status == "FINISHED" {
		update = bson.M{
			"$set": bson.M{
				"status":       "FINISHED",
				"deliveryman":  orderMsg.DeliveryMan,
				"lastModified": time.Now(),
			},
		}
	}

	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Printf("Erro ao atualizar o documento: %s", err)

	}

	if orderMsg.DeliveryMan.Status == "FINISHED" {
		var order dto.RequestPayload
		collection.FindOne(context.Background(), filter).Decode(&order)
		order.OrderId = orderID.Hex()
		orderBytes, err := json.Marshal(&order)
		if err == nil {
			PublishMessage(orderBytes)
		}
	}

	jsonData, _ := json.Marshal(orderMsg)
	sendMessageToClient(orderMsg.EstablishmentId, jsonData)

	log.Println("Documento atualizado com sucesso.")
}

func PublishMessage(body []byte) error {
	// Conectar ao servidor RabbitMQ
	dsn := os.Getenv("RABBIT_CONNECTION")
	if dsn == "" {
		panic("RABBIT_CONNECTION não configurado")
	}

	queueName := os.Getenv("RABBIT_DELIVERY_QUEUE")
	if queueName == "" {
		panic("RABBIT_DELIVERY_QUEUE não configurado")
	}

	conn, err := amqp.Dial(dsn)
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	_, err = ch.QueueDeclare(
		queueName,
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		return err
	}

	// Publicar a mensagem na fila
	err = ch.Publish(
		"",        // Exchange
		queueName, // Routing key
		false,     // Mandatory
		false,     // Immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
		})
	if err != nil {
		return err
	}

	// log.Printf(" [x] Sent %s", body)

	return nil
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
