import MenuLayout from "../../components/Menu";
import Texts from "../../constants/Texts";
import React from "react";

function Delivery() {
  return (
    <MenuLayout>
      <div className="ml-6">
        <h3 className="font-bold">{Texts.gestor_cardapio}</h3>
        <span className="font-light italic text-xs">{Texts.cardapio_desc}</span>
      </div>
      <div className=""></div>
    </MenuLayout>
  );
}

export default Delivery;
