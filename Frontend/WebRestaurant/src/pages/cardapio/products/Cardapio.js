import React, { useEffect, useState } from "react";
import MenuLayout from "../../../components/Menu";
import CardapioList from "../../../components/CardapioList";
import SearchInput from "../../../components/SearchInput";
import AddButton from "../../../components/AddButton";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import Strings from "../../../constants/Strings";
import Texts from "../../../constants/Texts";

const Cardapio = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  async function start() {
    try {
      const { data } = await api.get(
        "/api/order/products/" + user.establishment.id
      );
      setItems(data);
    } catch (E) {
      console.log(E);
    }
  }

  async function save(item) {
    const value = items.map((e) => {
      if (e.ID === item.id) {
        return {
          ...e,
          Name: item.name,
          Description: item.description,
          Price: item.price,
          Image: item.image,
        };
      }
      return e;
    });

    setItems(value);
  }

  useEffect(() => {
    start();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <MenuLayout>
      <h2 className="font-bold text-lg pl-4 mb-4">{Texts.gestor_ca}</h2>

      <div className="mb-6 ml-4 pr-6 mt-6 flex row-auto gap-2 w-full justify-between">
        <SearchInput onSearch={handleSearch} />
        <AddButton
          onClick={() => {
            setEditModalOpen(true);
            setSelectedItem(Strings.initial_order);
          }}
        />
      </div>
      <div style={{ height: "100%", overflowY: "scroll" }}>
        <CardapioList
          items={items.filter((item) =>
            item?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          editModalOpen={editModalOpen}
          selectedItem={selectedItem}
          setEditModalOpen={setEditModalOpen}
          setSelectedItem={setSelectedItem}
          onSave={save}
          onRefreshItens={start}
        />
      </div>
    </MenuLayout>
  );
};

export default Cardapio;
