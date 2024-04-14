import api from "./api";

async function getOrders(id) {
  try {
    const { data } = await api.get("/api/order/orders/" + id);

    return data
      .filter((e) => {
        if (!e.deliveryman) {
          return e;
        }
        if (e.deliveryman?.status !== "FINISHED") {
          return e;
        }
      })
      .map((e) => {
        return {
          id: e._id,
          column: e.status,
          data: {
            ...e,
          },
        };
      });
  } catch (e) {
    return [];
  }
}

async function alterStatus(droppableId, draggableId) {
  try {
    const { data } = await api.put("/api/order/orders/status", {
      id: draggableId,
      status: droppableId,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  getOrders,
  alterStatus,
};
