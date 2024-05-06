import api from "./api";

async function getEstablishment() {
  try {
    const { data } = await api.get("/api/auth/establishments");
    return data;
  } catch {
    return [];
  }
}

export default { getEstablishment };
