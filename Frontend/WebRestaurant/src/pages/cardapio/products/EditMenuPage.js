import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import MenuLayout from "../../../components/Menu";

const EditMenuPage = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState({
    ID: id,
    Name: "",
    Description: "",
    Price: 0,
    Image: "",
    EstablishmentID: 1, // Defina o ID do estabelecimento conforme necessário
    Categories: null,
  });

  // Função para carregar os detalhes do item do menu
  const loadMenuItem = async () => {
    try {
      const response = await api.get(`api/menu/${id}`);
      setMenuItem(response.data);
    } catch (error) {
      console.error("Erro ao carregar o item do menu:", error);
    }
  };

  // Função para atualizar o item do menu
  const updateMenuItem = async () => {
    try {
      await api.put(`api/menu/${id}`, menuItem);
      // Redirecionar ou exibir uma mensagem de sucesso
    } catch (error) {
      console.error("Erro ao atualizar o item do menu:", error);
    }
  };

  // Função para lidar com a alteração de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="Name"
            value={menuItem.Name}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="Description"
            value={menuItem.Description}
            onChange={handleChange}
            rows={4}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Preço
          </label>
          <input
            type="number"
            id="price"
            name="Price"
            value={menuItem.Price}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            URL da Imagem
          </label>
          <input
            type="text"
            id="image"
            name="Image"
            value={menuItem.Image}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={updateMenuItem}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default EditMenuPage;
