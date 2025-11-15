import React from "react";
import { useMovies } from "../context/MoviesContext";

export default function Header() {
  const { favorites } = useMovies();

  return (
    <header className="header">
      <h1>Movies — Galerie (Context)</h1>
      <div className="likes-badge">{favorites.length} favoris</div>
    </header>
  );
}
