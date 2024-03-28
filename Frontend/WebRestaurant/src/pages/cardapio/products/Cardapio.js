import React, { useEffect, useState } from "react";
import MenuLayout from "../../../components/Menu";
import CardapioList from "../../../components/CardapioList";
import SearchInput from "../../../components/SearchInput";
import AddButton from "../../../components/AddButton";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const Cardapio = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    start();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredItems = items.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MenuLayout>
      <h2 className="font-bold text-lg pl-4 mb-4">Gestor de Cardápio</h2>

      <div className="mb-6 ml-4 pr-6 mt-6 flex row-auto gap-2 w-full justify-between">
        <SearchInput onSearch={handleSearch} />
        <AddButton onClick={() => {}} />
      </div>

      <CardapioList items={filteredItems} />
    </MenuLayout>
  );
};

export default Cardapio;
