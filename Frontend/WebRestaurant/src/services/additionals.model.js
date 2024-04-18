import Strings from "../constants/Strings";
import api from "./api";

async function handlerVinculoProdutoAdicional(productID, additionalID) {
  try {
    const { data } = await api.post("/api/order/additional/product", {
      productID: parseInt(productID),
      additionalID: parseInt(additionalID),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getAdditionals(id) {
  try {
    const { data } = await api.get("/api/order/additional/" + id);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function updateAdditional(items, editItem) {
  try {
    const body = { ...editItem, Price: parseFloat(editItem.Price ?? 0) };
    const { data } = await api.put(
      "/api/order/additional/" + editItem.ID,
      body
    );
    const finalItem = items.map((e) => {
      if (e.ID === editItem.ID) {
        return data;
      }
      return e;
    });
    return finalItem;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function createAdditional(items, editItem, establishmentId) {
  try {
    const body = {
      ...editItem,
      EstablishmentId: establishmentId,
      Price: parseFloat(editItem.Price ?? 0),
    };
    const { data } = await api.post("/api/order/additional", body);

    return [data, ...items.filter((e) => e.ID && e.ID !== Strings.id_default)];
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteAdditional(items, id) {
  try {
    const { data } = await api.delete("/api/order/additional/" + id);

    return [...items.filter((e) => e.ID !== id)];
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  handlerVinculoProdutoAdicional,
  getAdditionals,
  deleteAdditional,
  updateAdditional,
  createAdditional,
};
