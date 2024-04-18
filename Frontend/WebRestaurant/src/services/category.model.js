import Strings from "../constants/Strings";
import api from "./api";

async function getCategories(id) {
  try {
    const { data } = await api.get("/api/order/categories/" + id);

    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function createCategory(items, editItem, establishmentId) {
  try {
    const body = {
      ...editItem,
      ID: null,
      EstablishmentId: establishmentId,
    };
    const { data } = await api.post("api/order/categories/create", body);

    return [
      { ID: data.Id, ...data },
      ...items.filter((e) => e.ID !== Strings.id_default),
    ];
  } catch (e) {
    console.log(e);
    return items;
  }
}

async function updateCategory(items, editItem, establishmentId) {
  try {
    const body = {
      ...editItem,
      EstablishmentId: establishmentId,
    };
    const { data } = await api.put(
      "/api/order/categories/" + editItem.ID,
      body
    );
    return items.map((e) => {
      if (e.ID === editItem.ID) return data;
      return e;
    });
  } catch (e) {
    return items;
  }
}

async function handlerVinculoProdutoCategoria(productID, categoryId) {
  try {
    const { data } = await api.post("/api/order/categories/product", {
      productID: parseInt(productID),
      categoryId: parseInt(categoryId),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteCategory(items, id) {
  try {
    const { data } = await api.delete("/api/order/categories/" + id);

    return [...items.filter((e) => e.ID !== id)];
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  getCategories,
  deleteCategory,
  updateCategory,
  handlerVinculoProdutoCategoria,
  createCategory,
};
