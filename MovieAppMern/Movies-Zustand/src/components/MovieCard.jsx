import { IMG_BASE } from "../api/moviesApi";
import { useMoviesStore } from "../zustand/useMoviesStore";

export default function MovieCard({ movie }) {
  const favorites = useMoviesStore((state) => state.favorites);
  const toggleFavorite = useMoviesStore((state) => state.toggleFavorite);

  const isFav = favorites.some((f) => f.id === movie.id);

  return (
    <div className="movie-card">
      <button
        className={`like-btn ${isFav ? "liked" : ""}`}
        onClick={() => toggleFavorite(movie)}
      >
        ⭐
      </button>

      <img src={IMG_BASE + movie.poster_path} alt={movie.title} />

      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-rating">⭐ {movie.vote_average}</div>
      </div>
    </div>
  );
}
