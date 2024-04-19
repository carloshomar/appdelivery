import api from "./api";

async function updateEstablishment(id, body) {
  try {
    const { data } = await api.put("/api/auth/establishments/" + id, {
      establishment: body,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  updateEstablishment,
};
