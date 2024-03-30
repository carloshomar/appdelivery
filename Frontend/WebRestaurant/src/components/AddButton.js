import React from "react";
import { FiPlus } from "react-icons/fi";

const AddButton = ({ onClick, text = "Novo" }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      <FiPlus className="h-5 w-5 mr-1" />
      {text}
    </button>
  );
};

export default AddButton;
