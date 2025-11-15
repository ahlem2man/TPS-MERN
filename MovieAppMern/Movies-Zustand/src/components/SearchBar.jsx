import { useMoviesStore } from "../zustand/useMoviesStore";
import { useEffect } from "react";

export default function SearchBar() {
  const query = useMoviesStore((state) => state.query);
  const setQuery = useMoviesStore((state) => state.setQuery);
  const loadMovies = useMoviesStore((state) => state.loadMovies);

  useEffect(() => {
    loadMovies();
  }, [query]);

  return (
    <input
      className="search-input"
      placeholder="Rechercher un film..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
