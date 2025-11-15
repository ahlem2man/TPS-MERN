import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import GenreFilter from "./components/GenreFilter";
import MovieGrid from "./components/MovieGrid";
import FavoritesSidebar from "./components/FavoritesSidebar";
import { useMovies } from "./context/MoviesContext";

export default function App() {
  const { loading, page, setPage, totalPages } = useMovies();

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="left">
          <SearchBar />
          <GenreFilter />
          <MovieGrid />
          <div className="pagination">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
              Prev
            </button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
              Next
            </button>
          </div>
          {loading && <div className="loading">Chargement...</div>}
        </div>

        <FavoritesSidebar />
      </div>
    </div>
  );
}
