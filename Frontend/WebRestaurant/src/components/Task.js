// src/components/Task.js
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import helper from "../helpers/helper";
const Task = ({ task, index, key }) => {
  const [showItems, setShowItems] = useState(false);

  const toggleItems = () => {
    setShowItems(!showItems);
  };

  const calculateFinalPrice = ({ item, quantity, additionals = [] }) => {
    const additionalPricesSum = additionals?.reduce((sum, additionalId) => {
      const additional = item.additional.find((a) => a.ID === additionalId);
      return sum + (additional?.price || 0);
    }, 0);

    const finalPrice = quantity * (item.price + (additionalPricesSum || 0));

    return finalPrice;
  };

  const subTotal =
    task.data.cart
      .map((e) => calculateFinalPrice(e))
      .reduce((e, f) => e + f, 0) || 0;

  return (
    <Draggable
      id={task.id}
      key={key}
      draggableId={task.id}
      index={index}
      type="TASK"
    >
      {(provided) => (
        <div
          className="bg-white p-2 mb-2 rounded shadow-md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="font-bold">{task.data.user.nome}</div>
          <div>Telefone: {task.data.user.phone}</div>
          <div>Forma de Pagamento: {task.data.paymentmethod.type}</div>
          <div className="mt-1">
            Total:{" "}
            <span className="font-bold">{helper.formatCurrency(subTotal)}</span>
          </div>
          <div className="mt-2">
            Itens no Carrinho:
            <button
              className="text-blue-500 underline p-1"
              onClick={toggleItems}
            >
              {showItems ? "Ocultar Itens" : "Visualizar Itens"}
            </button>
            {showItems ? (
              <div style={{ overflowY: "auto", padding: 15 }}>
                {task.data.cart.map((item, idx) => (
                  <div key={idx}>
                    <div>Item: {item.item.name}</div>
                    <div>Quantidade: {item.quantity}</div>
                    <div>Descrição: {item.item.description}</div>
                    <div>Preço Unitário: R$ {item.item.price.toFixed(2)}</div>
                    {idx != task.data.cart.length - 1 ? <hr /> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
