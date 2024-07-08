import api from "./api";

async function saveDeilvery({ establishmentId, fixedTaxa, perKm }) {
  try {
    const { data } = await api.post("/api/order/delivery", {
      establishmentId,
      fixedTaxa: parseFloat(fixedTaxa),
      perKm: parseFloat(perKm),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  saveDeilvery,
};
