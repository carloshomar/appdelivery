// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Board from "../../components/Board";
import MenuLayout from "../../components/Menu";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Texts from "../../constants/Texts";
import ordersModels from "../../services/orders.models";

const columns = [
  { id: "AWAIT_APPROVE", title: "Em análise", background: "#fb6f2d" },
  { id: "APPROVED", title: "Em produção", background: "#fc9f2c" },
  { id: "DONE", title: "Pronto p/ entrega", background: "#279348" },
  // { id: "FINSIHED", title: "Entregue" },
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const { getUser, socketMessage } = useAuth();
  const user = getUser();

  async function init() {
    if (!user) return;
    try {
      setTasks(await ordersModels.getOrders(getUser().id));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    init();
  }, [socketMessage]);

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

    await ordersModels.alterStatus(destination.droppableId, draggableId);
  };

  return (
    <MenuLayout>
      <h2 className=" font-bold text-lg pl-6 mb-2">{Texts.meus_pedidos}</h2>
      <Board tasks={tasks} columns={columns} onDragEnd={onDragEnd} />
    </MenuLayout>
  );
};

export default Home;
