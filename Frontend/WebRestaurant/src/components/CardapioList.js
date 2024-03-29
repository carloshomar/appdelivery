import React, { useState } from "react";
import helper from "../helpers/helper";
import CardapioEditModal from "../components/CardapioEditModal";

const MenuList = ({
  items,
  onSave,
  editModalOpen,
  setEditModalOpen,
  selectedItem,
  setSelectedItem,

  onRefreshItens,
}) => {
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  return (
    <ul className="pl-4 pr-4" style={{ overflowY: "auto" }}>
      {items.map((item, index) => (
        <li
          key={item.ID}
          className={`cursor-pointer select-none py-4  shadow-sm ${
            index === 0 ? "pt-0" : ""
          }`}
          onClick={() => handleEditClick(item)}
        >
          <div className="flex space-x-3 ">
            <img src={item.Image} className=" h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{item?.Name}</h3>
                <p className="text-lg text-gray-500 mr-2 mt-2 font-medium">
                  {helper.formatCurrency(item.Price)}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">{item.Description}</p>
            </div>
          </div>
        </li>
      ))}
      <CardapioEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItem}
        onSave={onSave}
        onRefreshItens={onRefreshItens}
      />
    </ul>
  );
};

export default MenuList;
