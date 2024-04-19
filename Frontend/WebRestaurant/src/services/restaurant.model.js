import api from "./api";

async function updateEstablishment(body) {
  try {
    const { data } = await api.put("", body);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  updateEstablishment,
};
