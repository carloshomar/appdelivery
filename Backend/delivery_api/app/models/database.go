package models

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient *mongo.Client
	MongoDabase *mongo.Database
)

func ConnectMongoDatabase() {
	mongoURI := os.Getenv("MONGO_URI")
	mongoDB := os.Getenv("MONGO_DATABASE")

	if mongoURI == "" {
		panic("MONGO_URI não configurado")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		panic(fmt.Sprintf("Falha ao conectar ao banco de dados MongoDB: %v", err))
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		panic(fmt.Sprintf("Falha ao pingar o servidor MongoDB: %v", err))
	}

	fmt.Println("Conexão com o MongoDB estabelecida com sucesso!")

	MongoClient = client
	MongoDabase = client.Database(mongoDB)
}
