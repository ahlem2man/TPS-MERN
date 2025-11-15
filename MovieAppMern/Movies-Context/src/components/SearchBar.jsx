import React, { useState } from "react";
import { useMovies } from "../context/MoviesContext";

export default function SearchBar() {
  const { setQuery } = useMovies();
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setQuery(q);
  };

  return (
    <form onSubmit={submit} className="search-bar">
      <input
        placeholder="Rechercher un film par titre..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit">Rechercher</button>
      <button type="button" onClick={() => { setQ(""); setQuery(""); }}>Réinitialiser</button>
    </form>
  );
}
