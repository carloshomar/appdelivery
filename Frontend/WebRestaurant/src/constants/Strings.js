import Texts from "./Texts";

const token_jwt = "JWT_TOKEN";
const initial_order = (item) => {
  return {
    ID: item?.ID || "",
    Name: item?.Name || "",
    Description: item?.Description || "",
    Price: item?.Price || 0,
    Image: item?.Image || "",
    Categories: item?.Categories ?? [],
    Additional: item?.Additional ?? [],
  };
};

const id_default = -9999999999;

const orderAvulsa = {
  cart: [],
  distance: "",
  location: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    ibge: "",
    gia: "",
    ddd: "",
    siafi: "",
    numero: "",
    coords: {
      latitude: "",
      longitude: "",
    },
  },
  paymentMethod: {
    type: "",
    icon: "",
  },
  deliveryValue: "",
  user: {
    phone: "",
    nome: "",
  },
  establishment: {
    horarioFuncionamento: "",
    image: "",
    lat: "",
    long: "",
    max_distance_delivery: 999999,
    name: "",
    owner_id: 0,
    primary_color: "",
    secondary_color: "",
    location_string: "",
  },
};

const itemOrder = {
  ID: "",
  Name: Texts.entregaAvulsa,
  Description: "",
  Price: 0,
  Image: "",
  EstablishmentID: 0,
  Categories: null,
  Additional: [],
  quantity: 1,
  id: "",
};
export default {
  token_jwt,
  initial_order,
  id_default,
  orderAvulsa,
  itemOrder,
};
