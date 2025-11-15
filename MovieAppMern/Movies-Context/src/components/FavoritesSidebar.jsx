import React from "react";
import { useMovies } from "../context/MoviesContext";
import { IMG_BASE } from "../api/moviesApi";

export default function FavoritesSidebar() {
  const { favorites, toggleFavorite } = useMovies();

  return (
    <aside className="favorites-sidebar">
      <h2>Favoris ({favorites.length})</h2>
      {favorites.length === 0 ? (
        <p style={{ color: "#95a5a6" }}>Aucun favori</p>
      ) : (
        favorites.map((f) => (
          <div key={f.id} className="favorite-item">
            <img src={f.poster_path ? IMG_BASE + f.poster_path : ""} alt={f.title} />
            <span>{f.title}</span>
            <button onClick={() => toggleFavorite(f)} aria-label={`Supprimer ${f.title}`}></button>
          </div>
        ))
      )}
    </aside>
  );
}
