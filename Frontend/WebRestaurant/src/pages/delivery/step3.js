import React from "react";

function Step3({ formData, handleChange }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-4">Local de Coleta</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Endereço Completo"
          value={formData.location.cep}
          onChange={(e) => handleChange(e, "location", "cep")}
          className="border p-2"
        />
        <br />
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
        {/* <input
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
        /> */}
      </div>
    </div>
  );
}

export default Step3;
