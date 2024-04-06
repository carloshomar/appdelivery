import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import MenuLayout from "./Menu";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Strings from "../constants/Strings";
import { toast } from "react-toastify";
import Texts from "../constants/Texts";

const CardapioEditModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  onRefreshItens,
}) => {
  const initial_order = Strings.initial_order;
  const [formData, setFormData] = useState({
    ...initial_order,
    id: item?.ID || "",
    name: item?.Name || "",
    description: item?.Description || "",
    price: item?.Price || 0,
    image: item?.Image || "",
  });
  const { getUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        ...initial_order,
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

  const handleChangeMoney = (e) => {
    const { name, value } = e.target;
    const moneyPattern = /^\d+(\.\d{0,2})?$/;

    if (moneyPattern.test(value) || value === "") {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      ...formData,
      price: parseFloat(formData.price),
      id: parseInt(formData.id) || null,
      establishmentId: getUser().id,
    };

    try {
      let response;
      if (formData.id) {
        response = await api.put(
          `/api/order/products/update/${formData.id}`,
          body
        );
      } else {
        response = await api.post("/api/order/products/create", body);
      }
      onSave(body);
      onRefreshItens();
      toast.success(Texts.cardapio_sucess);
      onClose();
    } catch (error) {
      toast.error(Texts.erro_cardapio);
      setError(Texts.erro_cardapio);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal bg-white h-full overflow-hidden"
    >
      <MenuLayout>
        <h2 className="font-bold text-lg pl-6 mb-2">{Texts.editar_itens}</h2>
        <div className="flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full p-6">
            <div className="flex row mb-4">
              {formData.id ? (
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
              ) : null}

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
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChangeMoney}
                  className="mt-1 p-1 border rounded-sm w-full"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                {Texts.description}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-sm w-full"
              />
            </div>
            <div className="w-full flex mb-4 row flex gap-6">
              <div className="mt-2">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Imagem do produto"
                    className="w-32 h-32 object-fill rounded-md border-2 border-primary"
                  />
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-black"
                >
                  {Texts.imagem}
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Insira a URL da imagem"
                  className="mt-1 p-1 h-10 border rounded-sm w-full"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mr-2"
              >
                {Texts.cancelar}
              </button>{" "}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded mr-2 hover:bg-menu1"
              >
                {Texts.salvar}
              </button>
            </div>
          </form>
        </div>
      </MenuLayout>
    </Modal>
  );
};

export default CardapioEditModal;
