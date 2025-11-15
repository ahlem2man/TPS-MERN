import { useDispatch, useSelector } from "react-redux";
import MovieCard from "./MovieCard";
import { loadPopularMovies, searchMovies } from "../store/moviesSlice";
import { useEffect } from "react";

export default function MovieGrid() {
  const dispatch = useDispatch();
  const { movies, loading, query, page } = useSelector((state) => state.movies);
  const { filterGenre } = useSelector((state) => state.movies);

  useEffect(() => {
    if (query.trim() === "") {
      dispatch(loadPopularMovies(page));
    } else {
      dispatch(searchMovies({ query, page }));
    }
  }, [dispatch, page, query]);

  if (loading)
    return <div className="loading">Chargement...</div>;

  const filtered = filterGenre === "all"
    ? movies
    : movies.filter((m) => m.genre_ids.includes(filterGenre));

  return (
    <div className="movie-grid">
      {filtered.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
