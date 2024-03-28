import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import MenuLayout from "./Menu";

const CardapioEditModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    id: item?.ID || "",
    name: item?.Name || "",
    description: item?.Description || "",
    price: item?.Price || 0,
    image: item?.Image || "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.ID || "",
        name: item.Name || "",
        description: item.Description || "",
        price: item.Price || 0,
        image: item.Image || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal bg-white">
      <MenuLayout>
        <h2 className="font-bold text-lg pl-6 mb-2">Editar Item</h2>
        <div className="flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full p-6">
            <div className="w-full flex mb-4">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Imagem do produto"
                  className="w-32 h-32 object-fill rounded-md border-2 border-primary"
                />
              )}
              {/* <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Insira a URL da imagem"
                className="mt-1 p-1 h-10 border rounded-sm w-full"
              /> */}
            </div>
            <div className="flex row mb-4">
              <div className="mb-4">
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-black"
                >
                  ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  disabled
                  className="mt-1 p-1 border rounded-sm w-12 mr-4"
                />
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-1 border rounded-sm w-full"
                />
              </div>
              <div className="mb-4 ml-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preço
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 p-1 border rounded-sm w-full"
                />
              </div>
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-sm w-full"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mr-2"
              >
                Cancelar
              </button>{" "}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded mr-2 hover:bg-menu1"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </MenuLayout>
    </Modal>
  );
};

export default CardapioEditModal;
