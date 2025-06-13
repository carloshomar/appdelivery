import React from "react";

function Step2({ item, formData, handleChange, handleItemChange }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-4">Informações do Pacote</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Descrição
          </label>
          <input
            id="description"
            type="text"
            placeholder="Descrição"
            value={item.Description}
            onChange={(e) => handleItemChange(e, "Description")}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium mb-1"
          >
            Método de Pagamento
          </label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod.type}
            onChange={(e) => handleChange(e, "paymentMethod", "type")}
            className="border p-2 h-10 w-full"
          >
            <option value="" disabled>
              Selecione um método de pagamento
            </option>
            <option value="pix">PIX</option>
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Step2;
