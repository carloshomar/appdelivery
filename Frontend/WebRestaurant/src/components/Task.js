import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import helper from "../helpers/helper";

import Texts from "../constants/Texts";
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
          <div>
            {Texts.phone}: {task.data.user.phone}
          </div>

          <div>
            {Texts.forma_pay}:{" "}
            {Texts[task.data.paymentmethod.type] ??
              task.data.paymentmethod.type}
          </div>
          <div className="mt-1">
            Total:{" "}
            <span className="font-bold text-lg ml-1">
              {helper.formatCurrency(subTotal)}
            </span>
          </div>
          <div>
            Código:{" "}
            <span className="font-bold text-lg ml-1">
              {helper.genCode(task.data._id, task.data.establishment.id)}
            </span>
          </div>

          {task.data?.deliveryman && task.data?.deliveryman?.id != 0 ? (
            <div className="mt-2 grid">
              <span>
                {Texts.entregador}: {task.data?.deliveryman?.name}
              </span>
              {task.data?.deliveryman?.phone ? (
                <span>
                  {Texts.phone}: {task.data?.deliveryman?.phone}
                </span>
              ) : null}
              <span>
                {Texts.status}:{" "}
                <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {Texts[task.data?.deliveryman?.status]}
                </span>
              </span>
            </div>
          ) : null}

          <div className="mt-2">
            {Texts.itens_carrinho}:
            <button
              className="text-blue-500 font-bold underline p-1"
              onClick={toggleItems}
            >
              {showItems ? Texts.ocultar_itens : Texts.vizualizar_itens}
            </button>
            {showItems ? (
              <div
                style={{
                  overflowY: "auto",

                  paddingTop: 5,
                }}
              >
                {task.data.cart.map((item, idx) => (
                  <>
                    <div key={idx} className="p-1">
                      <div>
                        {item.quantity}x <b>{item.item.name}</b>
                      </div>
                      <div>
                        {item.item.additional.map((additional) => (
                          <span>{additional.name}</span>
                        ))}
                      </div>
                    </div>
                    {idx != task.data.cart.length - 1 ? <hr /> : null}
                  </>
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
