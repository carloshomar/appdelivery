import React from "react";

function Step3({ formData, handleChange }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-4">Local de Coleta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="busca" className="block text-sm font-medium mb-1">
            Endereço
          </label>
          <input
            id="busca"
            type="text"
            placeholder="Av. Brasil - SP"
            value={formData.location.busca}
            onChange={(e) => handleChange(e, "location", "busca")}
            className="border p-2 w-full"
          />
        </div>
      </div>

      {formData.location.cep !== "" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-0 mt-4">
          <div>
            <label htmlFor="numero" className="block text-sm font-medium mb-1">
              Número
            </label>
            <input
              id="numero"
              type="text"
              placeholder="Número"
              value={formData.location.numero}
              onChange={(e) => handleChange(e, "location", "numero")}
              className="border p-2 w-full"
            />
          </div>
          <div>
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
              value={formData.location.complemento}
              onChange={(e) => handleChange(e, "location", "complemento")}
              className="border p-2 w-full"
            />
          </div>
        </div>
      )}

      {formData.location.cep !== "" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-0 mt-4">
          <span>
            <strong>CEP:</strong> {formData.location.cep}
          </span>
          <span>
            <strong>Logradouro:</strong> {formData.location.logradouro}
          </span>
          <span>
            <strong>Bairro:</strong> {formData.location.bairro}
          </span>
          <span>
            <strong>Localidade:</strong> {formData.location.localidade}
          </span>
          <span>
            <strong>UF:</strong> {formData.location.uf}
          </span>
          <span>
            <strong>Número:</strong> {formData.location.numero}
          </span>
          <span>
            <strong>Complemento:</strong> {formData.location.complemento}
          </span>
        </div>
      )}
    </div>
  );
}

export default Step3;
