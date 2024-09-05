import React from "react";

function Step4({ formData, handleChange }) {
  return (
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
          onChange={(e) => handleChange(e, "establishment", "location_string")}
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
  );
}

export default Step4;
