import { useDispatch, useSelector } from "react-redux";
import { IMG_BASE } from "../api/moviesApi";
import { toggleFavorite } from "../store/favoritesSlice";

export default function MovieCard({ movie }) {
  const dispatch = useDispatch();
  const favs = useSelector((state) => state.favorites);

  const isFav = favs.some((f) => f.id === movie.id);

  return (
    <div className="movie-card">
      <button
        className={`like-btn ${isFav ? "liked" : ""}`}
        onClick={() => dispatch(toggleFavorite(movie))}
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
