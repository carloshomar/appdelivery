import React, { useEffect, useInsertionEffect, useState } from "react";
import Modal from "react-modal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

import { MdDeleteOutline } from "react-icons/md";

import { toast } from "react-toastify";
import Texts from "../constants/Texts";
import additionalsModel from "../services/additionals.model";
import ReactModal from "react-modal";
import Strings from "../constants/Strings";
import categoryModel from "../services/category.model";
import helper from "../helpers/helper";

Modal.setAppElement("#root");

const ModalAddItens = ({
  isOpen,
  onClose,
  item,
  isCategory,
  onRefreshItens,
}) => {
  const [items, setItems] = useState([]);

  const { getUser } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);

  const [editItem, setEditItem] = useState(null);

  const init = async () => {
    const myid = getUser().id;
    setItems(
      isCategory
        ? await categoryModel.getCategories(myid)
        : await additionalsModel.getAdditionals(myid)
    );
  };

  async function saveItem() {
    const isCreate = !editItem.ID || editItem.ID === Strings.id_default;

    let finalItem = null;
    if (!isCategory) {
      finalItem = isCreate
        ? await additionalsModel.createAdditional(items, editItem, getUser().id)
        : await additionalsModel.updateAdditional(items, editItem);

      if (!finalItem) {
        toast.error(Texts.erro_cardapio);
        return;
      }
    } else {
      finalItem = isCreate
        ? await categoryModel.createCategory(items, editItem, getUser().id)
        : await categoryModel.updateCategory(items, editItem, getUser().id);
    }

    const tag = isCategory ? "Categories" : "Additional";

    if (item[tag].find((e) => e.ID === editItem.ID))
      await onRefreshItens({
        ...item,
        [tag]: selectedItems.map((e) => {
          if (e.ID === editItem.ID) {
            return editItem;
          }
          return e;
        }),
      });

    setItems(finalItem);
    toast.success(Texts.alteracao_aplicada);
  }

  function editId(id) {
    if (!id) {
      setEditItem(null);
    } else {
      const myItem = items.find((e) => e.ID === id);
      if (myItem) {
        setEditItem(myItem);
      }
    }
    setItems(
      items.map((e) => {
        return {
          ...e,
          edit: e.ID == id,
        };
      })
    );
  }

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = selectedItems.filter(
      (it) => it.ID !== itemToRemove.ID
    );

    setSelectedItems(updatedItems);
    return updatedItems;
  };

  const handlerItem = async (it) => {
    let finalItems = selectedItems;
    const resp = isCategory
      ? await categoryModel.handlerVinculoProdutoCategoria(item.ID, it.ID)
      : await additionalsModel.handlerVinculoProdutoAdicional(item.ID, it.ID);

    if (!selectedItems.find((a) => a.ID === it.ID)) {
      finalItems = [...selectedItems, it];
      setSelectedItems(finalItems);
    } else {
      finalItems = handleRemoveItem(it);
    }

    if (resp) {
      const tag = isCategory ? "Categories" : "Additional";
      await onRefreshItens({ ...item, [tag]: finalItems });

      toast.success(Texts.adicionado_no_produto);
    }
  };

  const handlerEditItem = (target) => {
    let value = target.value;

    setEditItem({
      ...editItem,
      [target.name]: value,
    });
  };

  const newItem = () => {
    const myNew = Strings.initial_order({
      ID: Strings.id_default,
      Name: Texts.novo_produto,
    });

    const myItens = items.map((e) => {
      return { ...e, edit: false };
    });

    setItems([{ ...myNew, edit: true }, ...myItens]);
    setEditItem({ ...myNew });
  };

  const removeNewItem = () => {
    const da = items.filter((e) => e.ID !== Strings.id_default);
    setItems(da);
  };

  const deleteItem = async (id) => {
    const newItem = isCategory
      ? await categoryModel.deleteCategory(items, id)
      : await additionalsModel.deleteAdditional(items, id);

    if (newItem) {
      toast.success(Texts.alteracao_aplicada);
      setItems(newItem);

      const tag = isCategory ? "Categories" : "Additional";
      await onRefreshItens({
        ...item,
        [tag]: item[tag].filter((e) => e.ID !== id),
      });
    } else {
      toast.error(Texts.erro_cardapio);
    }
  };

  useEffect(() => {
    init();
    const final = isCategory ? item.Categories : item.Additional;
    setSelectedItems(final ?? []);
  }, [isCategory, item]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onClose();
        editId(null);
        removeNewItem();
      }}
    >
      <div className="h-full justify-between overflow-hidden">
        <div className="h-full">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold">
              {isCategory ? "Categoria" : "Adicionais"}
            </h4>
            <button className="text-gray-400" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="mb-6 mt-6 justify-between flex gap-6">
            <input
              type="text"
              id="search"
              name="search"
              placeholder={Texts.search_placeholer}
              className="p-2 border rounded-sm w-full"
            />

            <button
              type="button"
              onClick={() => newItem()}
              disabled={items.find((e) => e.ID === Strings.id_default)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-menu1"
            >
              +
            </button>
          </div>

          <div className="h-[90%] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200  mb-6">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {Texts.id}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {Texts.acoes}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {Texts.nome}
                  </th>

                  {!isCategory ? (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {Texts.preco}
                    </th>
                  ) : null}
                  <th
                    scope="col"
                    className="w-16 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                  >
                    {Texts.adicionar_no_produto}?
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((myItem) => (
                  <tr key={myItem.ID} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-primary w-10">
                      {myItem.ID !== Strings.id_default ? myItem.ID : "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-primary w-10">
                      {!myItem.edit ? (
                        <div className="p-2 flex gap-6">
                          <FiEdit
                            className="cursor-pointer"
                            onClick={() => editId(myItem.ID)}
                            size={20}
                          />
                          <MdDeleteOutline
                            className="cursor-pointer"
                            onClick={() => deleteItem(myItem.ID)}
                            size={23}
                          />
                        </div>
                      ) : (
                        <div className="p-2 flex gap-6">
                          <FiX
                            size={21}
                            className="cursor-pointer"
                            onClick={() => {
                              editId(null);
                              if (myItem.ID == Strings.id_default)
                                removeNewItem();
                            }}
                          />
                          <FiSave
                            onClick={() => saveItem()}
                            size={20}
                            className="cursor-pointer"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-1/3">
                      {!myItem.edit ? (
                        myItem.Name
                      ) : (
                        <input
                          type="text"
                          id="name"
                          value={editItem?.Name}
                          name="Name"
                          onChange={({ target }) => handlerEditItem(target)}
                          className="mt-1 p-1 border rounded-sm w-full"
                        />
                      )}
                    </td>

                    {!isCategory ? (
                      <td className="px-6 py-4 whitespace-nowrap min-w-1/3">
                        {!myItem.edit ? (
                          helper.formatCurrency(myItem.Price)
                        ) : (
                          <input
                            type="number"
                            id="price"
                            value={editItem?.Price ?? 0}
                            name="Price"
                            onChange={({ target }) => handlerEditItem(target)}
                            className="mt-1 p-1 border rounded-sm w-full"
                          />
                        )}
                      </td>
                    ) : null}

                    <td className="px-10 py-4 whitespace-nowrap">
                      <input
                        type="radio"
                        disabled={myItem.ID === Strings.id_default}
                        className="form-radio text-green-600 hover:text-green-900 w-6 h-6"
                        checked={selectedItems.some(
                          (selectedItem) => selectedItem.ID === myItem.ID
                        )}
                        onClick={() => handlerItem(myItem)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddItens;
