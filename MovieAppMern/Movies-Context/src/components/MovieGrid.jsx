import React from "react";
import { useMovies } from "../context/MoviesContext";
import MovieCard from "./MovieCard";

export default function MovieGrid() {
  const { movies } = useMovies();

  if (!movies || movies.length === 0) {
    return <div className="no-results">Aucun film trouvé.</div>;
  }

  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
