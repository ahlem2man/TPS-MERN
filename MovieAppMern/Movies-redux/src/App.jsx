import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import GenreFilter from "./components/GenreFilter";
import MovieGrid from "./components/MovieGrid";
import FavoritesSidebar from "./components/FavoritesSidebar";

import { useDispatch, useSelector } from "react-redux";
import { setPage } from "./store/moviesSlice";

export default function App() {
  const dispatch = useDispatch();
  const { page, totalPages, loading } = useSelector((state) => state.movies);

  return (
    <div>
      <Header />

      <div className="main-container">
        {/* Left side */}
        <div>
          <SearchBar />
          <GenreFilter />
          <MovieGrid />

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
              disabled={page <= 1}
            >
              Prev
            </button>

            <span>Page {page} / {totalPages}</span>

            <button
              onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>

          {loading && <div className="loading">Chargement...</div>}
        </div>

        {/* Right sidebar */}
        <FavoritesSidebar />
      </div>
    </div>
  );
}
