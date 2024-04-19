import React, { useEffect, useState } from "react";
import MenuLayout from "../../components/Menu";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import Texts from "../../constants/Texts";
import restaurantModel from "../../services/restaurant.model";

function Perfil() {
  const { getUser } = useAuth();

  const [establishment, setEstablishment] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const handlerEstablishment = (target) => {
    setEstablishment({
      ...establishment,
      [target.name]: target.value,
    });
  };

  const init = async () => {
    try {
      const { data } = await api.get(
        "/api/auth/establishments/" + getUser().id
      );

      setEstablishment(data);

      const usert = getUser();

      setUser({
        name: usert.name,
        email: usert.email,
      });
    } catch (e) {
      console.log(e);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const resp = await restaurantModel.updateEstablishment(
      getUser().establishment_id,
      establishment
    );
    if (resp) {
      toast.success(Texts.restaurant_update);
    } else {
      toast.error(Texts.restaurant_error);
    }
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <MenuLayout>
      <div className="flex flex-wrap mt-2">
        <h4 className="px-6 font-bold">Usuário</h4>
      </div>
      <form className="w-full px-6 mt-4" onSubmit={submit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="name"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Nome
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
              type="text"
              name="name"
              placeholder="Jane"
              maxLength={200}
              required
              value={user.name}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="email"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              E-mail
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              name="email"
              type="email"
              required
              disabled
              placeholder="Doe"
              value={user.email}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6 mt-10">
          <h4 className="px-3 font-bold">Estabelecimento</h4>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="name"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Nome do Estabelecimento
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="name"
              maxLength={80}
              required
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.name}
            />
          </div>

          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="description"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Descrição
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              required
              maxLength={150}
              name="description"
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.description}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2 mt-6">
          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label
              htmlFor="primary_color"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Cor Primária
            </label>
            <input
              className="appearance-none py-6 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="color"
              required
              name="primary_color"
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.primary_color}
              style={{ backgroundColor: establishment.primary_color }}
            />
          </div>

          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label
              htmlFor="secondary_color"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Cor Secundária
            </label>
            <input
              className="appearance-none py-6 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="color"
              required
              name="secondary_color"
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.secondary_color}
              style={{ backgroundColor: establishment.secondary_color }}
            />
          </div>

          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label
              htmlFor="max_distance_delivery"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Distância máxima de entrega (km)
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              min={1}
              max={100}
              required
              name="max_distance_delivery"
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.max_distance_delivery}
            />
          </div>

          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label
              htmlFor="horarioFuncionamento"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Horario de Funcionário
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="horarioFuncionamento"
              maxLength={50}
              required
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.horarioFuncionamento}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              htmlFor="image"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              URL Logo
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="image"
              required
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.image}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2 mt-6">
          <div className="flex flex-wrap mt-4 mb-4">
            <h4 className="px-3 font-bold">Endereço</h4>
          </div>

          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              htmlFor="location_string"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Endereço Completo
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              name="location_string"
              required
              maxLength={250}
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.location_string}
            />
          </div>
        </div>{" "}
        <div className="flex flex-wrap -mx-3 mb-2 mt-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="lat"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              lat
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              name="lat"
              required
              disabled
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.lat}
            />
          </div>

          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="long"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              long
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              name="long"
              required
              disabled
              onChange={({ target }) => handlerEstablishment(target)}
              value={establishment.long}
            />
          </div>
        </div>
        <div className="mt-8 w-full">
          <button
            type="submit"
            disabled={loading}
            className="flex float-end items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded"
          >
            <FiSave className="h-5 w-5 mr-1" /> Salvar
          </button>
        </div>
      </form>
    </MenuLayout>
  );
}

export default Perfil;
