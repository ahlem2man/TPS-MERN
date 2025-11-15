import { useDispatch, useSelector } from "react-redux";
import { setQuery, setPage, searchMovies, loadPopularMovies } from "../store/moviesSlice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.movies);

  const handleSearch = (e) => {
    const value = e.target.value;
    dispatch(setQuery(value));

    if (value.trim() === "") {
      dispatch(loadPopularMovies(1));
    } else {
      dispatch(searchMovies({ query: value, page: 1 }));
    }
  };

  return (
    <input
      className="search-input"
      value={query}
      onChange={handleSearch}
      placeholder="Rechercher un film..."
    />
  );
}
