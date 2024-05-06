import api from "./api";

async function getOrders(phone: string) {
  try {
    const { data } = await api.get(
      "/api/order/orders/list-phone/" + phone.replace(/ /g, "")
    );
    return data;
  } catch {
    return [];
  }
}

export default { getOrders };
