import React from "react";
import { useMovies } from "../context/MoviesContext";

export default function GenreFilter() {
  const { genres, filterGenre, setFilterGenre } = useMovies();

  return (
    <div className="genre-filter">
      <button
        className={`filter-btn ${filterGenre === "all" ? "active" : ""}`}
        onClick={() => setFilterGenre("all")}
      >
        Tous
      </button>

      {genres.map((g) => (
        <button
          key={g.id}
          className={`filter-btn ${String(filterGenre) === String(g.id) ? "active" : ""}`}
          onClick={() => setFilterGenre(String(g.id))}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
