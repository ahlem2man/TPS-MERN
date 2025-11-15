import { useEffect } from "react";
import { useMoviesStore } from "../zustand/useMoviesStore";

export default function GenreFilter() {
  const genres = useMoviesStore((state) => state.genres);
  const filterGenre = useMoviesStore((state) => state.filterGenre);
  const setFilterGenre = useMoviesStore((state) => state.setFilterGenre);
  const loadGenres = useMoviesStore((state) => state.loadGenres);

  useEffect(() => {
    loadGenres();
  }, []);

  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${filterGenre === "all" ? "active" : ""}`}
        onClick={() => setFilterGenre("all")}
      >
        Tous
      </button>

      {genres.map((g) => (
        <button
          key={g.id}
          className={`filter-btn ${filterGenre === g.id ? "active" : ""}`}
          onClick={() => setFilterGenre(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
