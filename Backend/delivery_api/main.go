package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"

	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/carloshomar/vercardapio/app/routes"
)

func main() {
	// Carregar variáveis de ambiente
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar arquivo .env")
	}

	// Iniciar o servidor HTTP
	go startHTTPServer()

	// Iniciar o servidor que escuta a fila
	startQueueListener()

	// Mantém a aplicação em execução indefinidamente
	// até que seja explicitamente encerrada
	<-make(chan struct{})
}

func startHTTPServer() {
	app := fiber.New()

	// Configurar rotas
	routes.SetupRoutes(app)
	models.ConnectMongoDatabase()

	// Iniciar o servidor
	app.Listen(":3000")
}

func startQueueListener() {
	// Estabelecer conexão com o servidor de mensagens
	dsn := os.Getenv("RABBIT_CONNECTION")
	queueName := os.Getenv("RABBIT_DELIVERY_QUEUE")

	var conn *amqp.Connection
	var err error
	for {
		conn, err = amqp.Dial(dsn)
		if err == nil {
			break
		}
		log.Printf("Erro ao conectar ao servidor de mensagens: %s. Tentando novamente em 5 segundos...", err)
		time.Sleep(5 * time.Second)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal: %s", err)
	}
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Erro ao declarar a fila: %s", err)
	}

	// Loop infinito para consumir mensagens continuamente
	for {
		msgs, err := ch.Consume(
			queue.Name,
			"",    // Consumer
			true,  // Auto-ack
			false, // Exclusive
			false, // No-local
			false, // No-wait
			nil,   // Arguments
		)
		if err != nil {
			log.Fatalf("Erro ao registrar o consumidor: %s", err)
		}

		// Processar mensagens recebidas
		for msg := range msgs {
			bodyStr := string(msg.Body)
			handlers.CreateSolicitation(bodyStr)
		}
	}
}
