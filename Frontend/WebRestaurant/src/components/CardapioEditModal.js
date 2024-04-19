import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import MenuLayout from "./Menu";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Strings from "../constants/Strings";
import { toast } from "react-toastify";
import Texts from "../constants/Texts";
import helper from "../helpers/helper";
import ModalAddItens from "./ModalAddItens";
import productsModel from "../services/products.model";

const CardapioEditModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  onRefreshItens,
}) => {
  const [formData, setFormData] = useState(Strings.initial_order(item));
  const { getUser } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCategory, setIsCategory] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(Strings.initial_order(item));
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

  const openAlert = () => {
    toast.info(Texts.salve_primeiro);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      Price: parseFloat(formData.Price),
      Id: parseInt(formData.ID) || null,
      ID: parseInt(formData.ID) || null,
      EstablishmentId: getUser().id,
      Categories: null,
    };

    try {
      if (formData.ID) {
        await api.put(`/api/order/products/update/${formData.ID}`, body);
      } else {
        await api.post("/api/order/products/create", body);
      }
      onSave(body);
      onRefreshItens();
      toast.success(Texts.cardapio_sucess);
      onClose();
    } catch (error) {
      toast.error(Texts.erro_cardapio);
    }
  };

  const deleteProduct = async () => {
    const resp = await productsModel.deleteProduct(item.ID);
    if (resp) {
      toast.success(Texts.removido_produto);
      onRefreshItens();
      onClose();
    } else {
      toast.error(Texts.falha_remover_produto);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal bg-white h-full overflow-hidden"
    >
      <MenuLayout>
        <h2 className="font-bold text-lg pl-6">
          {item?.ID ? Texts.editar_itens : Texts.novo_produto}
        </h2>
        <div className="flex flex-col items-center sm:h-[90vh] md:h-auto lg:h-auto">
          <form onSubmit={handleSubmit} className="w-full p-6 overflow-y-auto">
            <div className="w-full lg:row md:row sm:flex-col md:flex-row lg:flex-row flex gap-6">
              {formData.Image && (
                <div className="sm:mt-0 md:mt-2 lg:mt-2">
                  <img
                    src={formData.Image}
                    alt="Imagem do produto"
                    className="md:h-[150px] md:w-[200px] sm:w-full sm:h-[250px] object-cover rounded-md border-2 border-primary"
                  />
                </div>
              )}
              <div className="w-full">
                <div className="flex row mb-4">
                  {formData.ID ? (
                    <div className="">
                      <label
                        htmlFor="id"
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      >
                        {Texts.id}
                      </label>
                      <input
                        id="ID"
                        name="ID"
                        value={formData.ID}
                        disabled
                        className="appearance-none block w-20 mr-2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      />
                    </div>
                  ) : null}

                  <div className=" w-full">
                    <label
                      htmlFor="name"
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                      {Texts.nome}
                    </label>
                    <input
                      type="text"
                      id="Name"
                      required
                      maxLength={100}
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                  </div>
                  <div className=" ml-4">
                    <label
                      htmlFor="Price"
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                      {Texts.preco}
                    </label>
                    <input
                      type="number"
                      id="Price"
                      name="Price"
                      value={formData.Price}
                      onChange={handleChangeMoney}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                  </div>
                </div>

                <div className="w-full mt-4">
                  <label
                    htmlFor="Image"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    {Texts.imagem}
                  </label>
                  <input
                    type="text"
                    id="Image"
                    maxLength={450}
                    name="Image"
                    value={formData.Image}
                    onChange={handleChange}
                    placeholder="Insira a URL da imagem"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 mt-6">
              <label
                htmlFor="Description"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                {Texts.description}
              </label>
              <textarea
                id="Description"
                name="Description"
                maxLength={150}
                value={formData.Description}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <div className="mt-6 mb-4">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {Texts.categorias}
              </label>
              <div className="mt-2 items-center flex">
                <button
                  type="button"
                  onClick={() => {
                    if (!item?.ID) openAlert();
                    else {
                      setIsCategory(true);
                      setIsOpenModal(true);
                    }
                  }}
                  className={`${
                    !item?.ID ? "bg-blue-300" : "bg-primary hover:bg-menu1"
                  } text-white px-4 py-2 rounded mr-4 disabled:bg-blue-300`}
                >
                  +
                </button>
                {formData.Categories.map((e) => (
                  <div className="bg-blue-100 text-blue-800 text-base font-medium me-2 px-2.5 py-2  rounded dark:bg-blue-900 dark:text-blue-300 justify-between">
                    <span className="cursor-default">{e.Name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 mb-4">
              <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {Texts.additional}
              </span>
              <div className="mt-2   items-center flex">
                <button
                  type="button"
                  onClick={() => {
                    if (!item?.ID) openAlert();
                    else {
                      setIsCategory(false);
                      setIsOpenModal(true);
                    }
                  }}
                  className={`${
                    !item?.ID ? "bg-blue-300" : "bg-primary hover:bg-menu1"
                  } text-white px-4 py-2 rounded mr-4 disabled:bg-blue-300`}
                >
                  +
                </button>
                {formData.Additional.map((e) => (
                  <div className="bg-blue-100 text-blue-800 text-base font-medium me-2 px-2.5 py-2  rounded dark:bg-blue-900 dark:text-blue-300 justify-between">
                    <span className="cursor-default">
                      {e.Name}
                      <span className="text-xs font-light ml-1">
                        ({helper.formatCurrency(e.Price)})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:mt-12 md:mt-12 sm:mt-8 flex justify-between w-full">
              <div>
                <button
                  type="button"
                  onClick={() => deleteProduct()}
                  disabled={!item?.ID}
                  className="bg-red-500 text-white px-4 py-2 rounded  disabled:bg-red-400  hover:bg-red-400 mr-2"
                >
                  {Texts.remover_produto}
                </button>
              </div>
              <div>
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
            </div>
          </form>
        </div>
      </MenuLayout>
      <ModalAddItens
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
        onSave={onSave}
        onRefreshItens={onRefreshItens}
        item={item}
        isCategory={isCategory}
      />
    </Modal>
  );
};

export default CardapioEditModal;
