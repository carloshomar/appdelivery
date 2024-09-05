import React from "react";

function Step3({ formData, handleChange }) {
  return (
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
          placeholder="Bairro"
          value={formData.location.bairro}
          onChange={(e) => handleChange(e, "location", "bairro")}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Cidade"
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
          placeholder="Complemento"
          value={formData.location.complemento}
          onChange={(e) => handleChange(e, "location", "complemento")}
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
  );
}

export default Step3;
