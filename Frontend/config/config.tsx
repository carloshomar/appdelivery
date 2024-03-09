const APP_MODE_OPTIONS = {
  unique: 1, // UNICO ESTABELECIMENTO
  multi: 2, //  DOIS ESTABELECIMENTOS
};

const APP_MODE = APP_MODE_OPTIONS.multi;

// SOMENTE APP_MODE == APP_MODE_OPTIONS.unique
const ESTABLISHMENT_ID = 1;
const ESTABLISHMENT = {
  id: ESTABLISHMENT_ID,
  name: "El Chavo Burritos",
  image:
    "https://static.vecteezy.com/system/resources/previews/014/971/638/non_2x/food-logo-design-template-restaurant-free-png.png",
  horarioFuncionamento: "22h",
  lat: -21.778131,
  long: -43.367493,
  max_distancy_delivery: 10, // km
};

const PAYMENT_TYPE = [
  {
    type: "credit",
    icon: "credit-score",
  },
  {
    type: "debit",
    icon: "credit-card",
  },
  {
    type: "money",
    icon: "money",
  },
  {
    type: "pix",
    icon: "pix",
  },
];

export {
  ESTABLISHMENT_ID,
  ESTABLISHMENT,
  APP_MODE,
  APP_MODE_OPTIONS,
  PAYMENT_TYPE,
};
