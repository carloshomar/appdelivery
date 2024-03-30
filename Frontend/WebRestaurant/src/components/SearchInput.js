import React, { useState } from "react";

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);

    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar..."
      style={{ width: "100%" }}
      value={searchTerm}
      onChange={handleChange}
      className="border border-gray-300 rounded-md py-2 px-4 w-100 focus:outline-none focus:border-blue-500"
    />
  );
};

export default SearchInput;
