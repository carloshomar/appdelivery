package handlers

import (
	"log"
	"os"

	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func PublishMessage(body []byte) error {
	// Conectar ao servidor RabbitMQ
	dsn := os.Getenv("RABBIT_CONNECTION")
	if dsn == "" {
		panic("RABBIT_CONNECTION não configurado")
	}

	queueName := os.Getenv("RABBIT_ORDER_QUEUE")
	if queueName == "" {
		panic("RABBIT_ORDER_QUEUE não configurado")
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
