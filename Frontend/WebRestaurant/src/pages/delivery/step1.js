import React from "react";

function Step1({ formData, handleChange }) {
  return (
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
  );
}

export default Step1;
