import { useSelector, useDispatch } from "react-redux";
import { IMG_BASE } from "../api/moviesApi";
import { toggleFavorite } from "../store/favoritesSlice";

export default function FavoritesSidebar() {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  return (
    <div className="favorites-sidebar">
      <h2>Mes Favoris ({favorites.length})</h2>

      {favorites.length === 0 && (
        <p style={{ color: "#95a5a6" }}>Aucun favori</p>
      )}

      {favorites.map((movie) => (
        <div className="favorite-item" key={movie.id}>
          <img src={IMG_BASE + movie.poster_path} alt={movie.title} />
          <span>{movie.title}</span>

          <button
            onClick={() => dispatch(toggleFavorite(movie))}
            className="remove-fav"
          >
            
          </button>
        </div>
      ))}
    </div>
  );
}
