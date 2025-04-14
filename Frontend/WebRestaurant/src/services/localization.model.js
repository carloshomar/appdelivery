import Strings from "../constants/Strings";
import api from "./api";

async function getLocalization(id) {
  return {
    cep: "12345-678",
    logradouro: "Rua das Flores",
    complemento: "Apto 101",
    bairro: "Jardim Primavera",
    localidade: "São Paulo",
    uf: "SP",
    ibge: "3550308",
    gia: "1234",
    ddd: "11",
    siafi: "7107",
    numero: "456",
    coords: {
      latitude: "-23.550520",
      longitude: "-46.633308",
    },
  };

  try {
    const { data } = await api.get(
      `/api/order/localization/get-location?address=${id}`
    );

    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export default {
  getLocalization,
};
