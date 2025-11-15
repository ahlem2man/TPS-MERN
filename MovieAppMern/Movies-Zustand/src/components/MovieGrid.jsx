import { useEffect } from "react";
import { useMoviesStore } from "../zustand/useMoviesStore";
import MovieCard from "./MovieCard";

export default function MovieGrid() {
  const movies = useMoviesStore((state) => state.movies);
  const loading = useMoviesStore((state) => state.loading);
  const page = useMoviesStore((state) => state.page);
  const query = useMoviesStore((state) => state.query);
  const filterGenre = useMoviesStore((state) => state.filterGenre);
  const loadMovies = useMoviesStore((state) => state.loadMovies);

  useEffect(() => {
    loadMovies();
  }, [page, query]);

  if (loading) return <div className="loading">Chargement...</div>;

  const filtered =
    filterGenre === "all"
      ? movies
      : movies.filter((m) => m.genre_ids.includes(filterGenre));

  return (
    <div className="movie-grid">
      {filtered.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
