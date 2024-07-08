import { FiSave } from "react-icons/fi";
import MenuLayout from "../../components/Menu";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import deliveryModel from "../../services/delivery.model";
import { toast } from "react-toastify";
import Texts from "../../constants/Texts";

/// Somente a parte de update está funcionando, ainda não fiz o Get para retornar o valor atual.
function Taxes() {
  const { getUser } = useAuth();

  const [body, setBody] = useState({
    establishmentId: getUser().id,
    fixedTaxa: 0,
    perKm: 0,
  });

  const save = async (e) => {
    e.preventDefault();
    const resp = await deliveryModel.saveDeilvery(body);
    if (resp) {
      toast.success(Texts.delivery_update);
    } else {
      toast.error(Texts.delivery_error);
    }
  };

  return (
    <MenuLayout>
      <div className="mt-4 w-full">
        <div className="ml-6">
          <h3 className="font-bold">{Texts.delivery_conf}</h3>
          <span className="font-light italic text-xs">{Texts.taxes_desc}</span>
        </div>
        <form className="w-full px-6 mt-8" onSubmit={save}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="name"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                Taxa de Serviço{" "}
                <span className="text-xs font-extrabold">(valor fixo)</span>
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                required
                value={body.fixedTaxa}
                onChange={({ target }) =>
                  setBody({ ...body, fixedTaxa: target.value })
                }
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="email"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                Valor por Kilometro
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                required
                onChange={({ target }) =>
                  setBody({ ...body, perKm: target.value })
                }
                value={body.perKm}
              />
            </div>
          </div>

          <div className="flex flex-wrap">
            <button
              type="submit"
              className="flex float-end items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded"
            >
              <FiSave className="h-5 w-5 mr-1" /> Salvar
            </button>
          </div>
        </form>
      </div>
    </MenuLayout>
  );
}

export default Taxes;
