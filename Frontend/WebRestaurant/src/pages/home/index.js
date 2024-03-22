// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Board from "../../components/Board";
import MenuLayout from "../../components/Menu";
import api from "../../services/api";

const columns = [
  { id: "AWAIT_APPROVE", title: "Aguardando Aprovação" },
  { id: "APPROVED", title: "Aprovado" },
  { id: "DONE", title: "Pronto para entrega" },
  { id: "FINSIHED", title: "Entregue" },
];

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const init = async () => {
    const { data } = await api.get("/api/order/orders/1");
    setTasks(
      data.map((e) => {
        return {
          id: e._id,
          column: e.status,
          data: {
            ...e,
          },
        };
      })
    );
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    setTasks(
      tasks.map((e) => {
        if (e.id === draggableId) {
          return {
            ...e,
            column: destination.droppableId,
          };
        }
        return e;
      })
    );
    const { data } = await api.put("/api/order/orders/status", {
      id: draggableId,
      status: destination.droppableId,
    });

    await init();
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <MenuLayout>
      <Board tasks={tasks} columns={columns} onDragEnd={onDragEnd} />
    </MenuLayout>
  );
};

export default Home;
