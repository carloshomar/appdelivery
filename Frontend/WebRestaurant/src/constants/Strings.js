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
export default {
  token_jwt,
  initial_order,
  id_default,
};
