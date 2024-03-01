package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/carloshomar/vercardapio/app/models"
	"github.com/carloshomar/vercardapio/app/routes"
)

func main() {
	// Carregar variáveis de ambiente
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar arquivo .env")
	}

	// Configurar o banco de dados
	models.ConnectDatabase()

	app := fiber.New()

	// Configurar rotas
	routes.SetupRoutes(app)

	// Iniciar o servidor
	app.Listen(":3000")
}
