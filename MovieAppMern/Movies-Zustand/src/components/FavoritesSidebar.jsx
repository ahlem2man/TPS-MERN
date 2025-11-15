import { useMoviesStore } from "../zustand/useMoviesStore";
import { IMG_BASE } from "../api/moviesApi";

export default function FavoritesSidebar() {
  const favorites = useMoviesStore((state) => state.favorites);
  const toggleFavorite = useMoviesStore((state) => state.toggleFavorite);

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
            onClick={() => toggleFavorite(movie)}
            className="remove-fav"
          >
            
          </button>
        </div>
      ))}
    </div>
  );
}
