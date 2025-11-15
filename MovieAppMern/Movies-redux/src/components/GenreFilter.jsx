import { useDispatch, useSelector } from "react-redux";
import { loadGenres } from "../store/moviesSlice";
import { setFilterGenre } from "../store/moviesSlice";
import { useEffect } from "react";

export default function GenreFilter() {
  const dispatch = useDispatch();
  const { genres, filterGenre } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(loadGenres());
  }, [dispatch]);

  return (
    <div className="filter-bar">
      <button
        className={filterGenre === "all" ? "filter-btn active" : "filter-btn"}
        onClick={() => dispatch(setFilterGenre("all"))}
      >
        Tous
      </button>

      {genres.map((g) => (
        <button
          key={g.id}
          className={filterGenre === g.id ? "filter-btn active" : "filter-btn"}
          onClick={() => dispatch(setFilterGenre(g.id))}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
