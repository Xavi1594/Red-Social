import React, { useState } from "react";

const SearchBar = ({
  onSearch,
  usuariosRegistrados,
  setUsuariosRegistrados,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <form className="d-flex my-2 my-lg-0 ms-auto">
      <input
        className="form-control me-2"
        type="search"
        placeholder="Buscar"
        aria-label="Buscar"
        value={searchTerm}
        onChange={handleSearch}
      />
    </form>
  );
};

export default SearchBar;
