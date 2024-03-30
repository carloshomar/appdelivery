package main

import (
	"log"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"

	"github.com/carloshomar/vercardapio/app/handlers"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/carloshomar/vercardapio/app/routes"
)

var clients = make(map[int64]*websocket.Conn)
var clientsMu sync.Mutex

func sendMessageToClient(clientID int64, message []byte) error {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	if client, ok := clients[clientID]; ok {
		return client.WriteMessage(websocket.TextMessage, message)
	}
	return nil
}

func startQueueListener() {
	dsn := os.Getenv("RABBIT_CONNECTION")
	queueName := os.Getenv("RABBIT_ORDER_QUEUE")

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
			"orders_api", // Consumer
			true,         // Auto-ack
			false,        // Exclusive
			false,        // No-local
			false,        // No-wait
			nil,          // Arguments
		)
		if err != nil {
			log.Fatalf("Erro ao registrar o consumidor: %s", err)
		}

		// Processar mensagens recebidas
		for msg := range msgs {
			bodyStr := string(msg.Body)
			handlers.ReceiveMessage(bodyStr, sendMessageToClient)
		}
	}
}

func startHTTPServer() {

	// Configurar o banco de dados
	models.ConnectPostgresDatabase()
	models.ConnectMongoDatabase()

	app := fiber.New()

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/:id", websocket.New(func(c *websocket.Conn) {
		log.Println(c.Locals("allowed"))
		log.Println(c.Params("id"))
		log.Println(c.Query("v"))
		log.Println(c.Cookies("session"))

		clientIDStr := c.Params("id")
		clientID, _ := strconv.ParseInt(clientIDStr, 10, 64)

		clientsMu.Lock()
		clients[clientID] = c
		clientsMu.Unlock()

		defer func() {
			clientsMu.Lock()
			delete(clients, clientID)
			clientsMu.Unlock()
		}()

		var (
			mt  int
			msg []byte
			err error
		)

		for {
			if mt, msg, err = c.ReadMessage(); err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", msg)

			if err = c.WriteMessage(mt, msg); err != nil {
				log.Println("write:", err)
				break
			}
		}

	}))

	// Configurar rotas
	routes.SetupRoutes(app, sendMessageToClient)

	// Iniciar o servidor
	app.Listen(":3000")
}

func main() {
	// Carregar variáveis de ambiente
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar arquivo .env")
	}

	go startHTTPServer()

	// Iniciar o servidor que escuta a fila
	startQueueListener()

	// Mantém a aplicação em execução indefinidamente
	// até que seja explicitamente encerrada
	<-make(chan struct{})

}
