import MenuLayout from "../../components/Menu";
import Strings from "../../constants/Strings";
import Texts from "../../constants/Texts";
import React, { useState } from "react";

function Delivery() {
  const [formData, setFormData] = useState(Strings.orderAvulsa);

  const [item, setItem] = useState([
    {
      ID: "",
      Name: "",
      Description: "",
      Price: "",
      Image: "",
      EstablishmentID: "",
      Categories: "",
      Additional: [],
      quantity: "",
      id: "",
    },
  ]);

  const handleChange = (e, section, key) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: value,
      },
    }));
  };

  const handleItemChange = (e, key) => {
    const value = e.target.value;
    setItem((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const addItemToCart = () => {
    setFormData((prevState) => ({
      ...prevState,
      cart: [
        ...prevState.cart,
        {
          item,
          additionals: [],
          quantity: item.quantity,
          id: Date.now().toString(),
        },
      ],
    }));
    setItem({
      ID: "",
      Name: "",
      Description: "",
      Price: "",
      Image: "",
      EstablishmentID: "",
      Categories: "",
      Additional: [],
      quantity: "",
      id: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Aqui você pode enviar formData para o seu servidor ou processar como necessário
  };

  return (
    <MenuLayout>
      <div className="ml-6">
        <h3 className="font-bold">{Texts.gestor_cardapio}</h3>{" "}
      </div>
      <div className="">
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div>
            <h2 className="text-sm font-bold mb-4">Informações do Usuário</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Telefone"
                value={formData.user.phone}
                onChange={(e) => handleChange(e, "user", "phone")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Nome"
                value={formData.user.nome}
                onChange={(e) => handleChange(e, "user", "nome")}
                className="border p-2"
              />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold mb-4">Informações do Pacote</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Descrição"
                value={item.Description}
                onChange={(e) => handleItemChange(e, "Description")}
                className="border p-2"
              />
              <select
                type="text"
                placeholder="Tipo"
                value={formData.paymentMethod.type}
                onChange={(e) => handleChange(e, "paymentMethod", "type")}
                className="border p-2 h-10"
              >
                <option value="pix">PIX</option>
                <option value="credit">Crédito</option>
                <option value="debit">Débito</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-4">Local de Coleta</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CEP"
                value={formData.location.cep}
                onChange={(e) => handleChange(e, "location", "cep")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Logradouro"
                value={formData.location.logradouro}
                onChange={(e) => handleChange(e, "location", "logradouro")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Complemento"
                value={formData.location.complemento}
                onChange={(e) => handleChange(e, "location", "complemento")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={formData.location.bairro}
                onChange={(e) => handleChange(e, "location", "bairro")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Localidade"
                value={formData.location.localidade}
                onChange={(e) => handleChange(e, "location", "localidade")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="UF"
                value={formData.location.uf}
                onChange={(e) => handleChange(e, "location", "uf")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Número"
                value={formData.location.numero}
                onChange={(e) => handleChange(e, "location", "numero")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Latitude"
                value={formData.location.coords.latitude}
                onChange={(e) => handleChange(e, "location", "latitude")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.location.coords.longitude}
                onChange={(e) => handleChange(e, "location", "longitude")}
                className="border p-2"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-4">Local de Entrega</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.establishment.name}
                onChange={(e) => handleChange(e, "establishment", "name")}
                className="border p-2"
              />

              <input
                type="text"
                placeholder="Endereço"
                value={formData.establishment.location_string}
                onChange={(e) =>
                  handleChange(e, "establishment", "location_string")
                }
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Latitude"
                value={formData.establishment.lat}
                onChange={(e) => handleChange(e, "establishment", "lat")}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.establishment.long}
                onChange={(e) => handleChange(e, "establishment", "long")}
                className="border p-2"
              />
            </div>
          </div>

          <button type="submit" className="bg-green-500 text-white py-2 px-4">
            Solicitar Entrega
          </button>
        </form>
      </div>
    </MenuLayout>
  );
}

export default Delivery;
