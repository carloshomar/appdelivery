import React from "react";

function Step2({ item, formData, handleChange, handleItemChange }) {
  return (
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
  );
}

export default Step2;
