import Texts from "@/constants/Texts";

const ESTABLISHMENT_ID = 1;

const ESTABLISHMENT = {
  id: ESTABLISHMENT_ID,
  name: "El Chavo Burritos",
  logo_uri:
    "https://static.vecteezy.com/system/resources/previews/014/971/638/non_2x/food-logo-design-template-restaurant-free-png.png",
  horarioFuncionamento: "22h",
  coords: {
    lat: -21.778131,
    long: -43.367493,
    max_distancy_delivery: 10, // km
  },
  payment: [
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
  ],
};

export { ESTABLISHMENT_ID, ESTABLISHMENT };
