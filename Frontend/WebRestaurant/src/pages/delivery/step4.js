import React, { useEffect, useState } from "react";
import localizationModel from "../../services/localization.model";

function Step4({ formData, handleChange }) {
  const [endereco, setEndereco] = useState("");
  const [address, setAddress] = useState({ cep: null });

  async function preencherEndereco() {
    if (endereco.length <= 3) {
      return;
    }

    try {
      const response = await localizationModel.getLocalization(endereco);

      if (response) {
        handleChange(
          parseFloat(response?.coords?.latitude ?? 0),
          "establishment",
          "lat"
        );
        handleChange(
          parseFloat(response?.coords?.longitude ?? 0),
          "establishment",
          "long"
        );

        const addressText = `${response.logradouro}, ${response.numero}, ${response.complemento}, ${response.bairro}, ${response.localidade} - ${response.uf}, CEP: ${response.cep}.`;
        handleChange(
          {
            target: {
              value: addressText,
            },
          },
          "establishment",
          "location_string"
        );
        setAddress(response);
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
    }
  }

  useEffect(() => {
    preencherEndereco();
  }, [endereco]);

  return (
    <div>
      <h2 className="text-sm font-bold mb-4">Local de Entrega</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nome"
            value={formData.establishment.name}
            onChange={(e) => handleChange(e, "establishment", "name")}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium mb-1">
            Endereço
          </label>
          <input
            id="endereco"
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
      </div>

      {address?.cep !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-0 mt-4">
          <div>
            <label htmlFor="numero" className="block text-sm font-medium mb-1">
              Número
            </label>
            <input
              id="numero"
              type="text"
              placeholder="Número"
              value={address?.numero || ""}
              onChange={(e) =>
                setAddress({ ...address, numero: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="complemento"
              className="block text-sm font-medium mb-1"
            >
              Complemento
            </label>
            <input
              id="complemento"
              type="text"
              placeholder="Complemento"
              value={address?.complemento || ""}
              onChange={(e) =>
                setAddress({ ...address, complemento: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>
        </div>
      )}

      {address?.cep !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-0 mt-4">
          <span>
            <strong>CEP:</strong> {address?.cep}
          </span>
          <span>
            <strong>Logradouro:</strong> {address?.logradouro}
          </span>
          <span>
            <strong>Bairro:</strong> {address?.bairro}
          </span>
          <span>
            <strong>Localidade:</strong> {address?.localidade}
          </span>
          <span>
            <strong>UF:</strong> {address?.uf}
          </span>
          <span>
            <strong>Número:</strong> {address?.numero}
          </span>
          <span>
            <strong>Complemento:</strong> {address?.complemento}
          </span>
        </div>
      )}
    </div>
  );
}

export default Step4;
