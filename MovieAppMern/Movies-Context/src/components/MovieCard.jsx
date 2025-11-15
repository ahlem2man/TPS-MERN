import React from "react";
import { useMovies } from "../context/MoviesContext";
import { IMG_BASE } from "../api/moviesApi";

export default function MovieCard({ movie }) {
  const { favorites, toggleFavorite } = useMovies();
  const isFav = favorites.some((m) => m.id === movie.id);

  return (
    <div className="movie-card">
      <button className={`like-btn ${isFav ? "liked" : ""}`} onClick={() => toggleFavorite(movie)}>
        {isFav ? "⭐" : "☆"}
      </button>
      <img src={movie.poster_path ? IMG_BASE + movie.poster_path : ""} alt={movie.title} />
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-meta">{movie.release_date} • {Math.round(movie.vote_average * 10) / 10}/10</div>
      </div>
    </div>
  );
}
