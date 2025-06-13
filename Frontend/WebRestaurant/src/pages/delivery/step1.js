import React from "react";

function Step1({ formData, handleChange }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-4">Informações do Usuário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Alex Almeida"
            value={formData.user.nome}
            onChange={(e) => handleChange(e, "user", "nome")}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefone
          </label>
          <input
            id="phone"
            type="text"
            placeholder="(11) 00000-0000"
            value={formData.user.phone}
            onChange={(e) => handleChange(e, "user", "phone")}
            className="border p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Step1;
