import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPopularMovies, fetchGenres, searchMovies } from "../api/moviesApi";

const MoviesContext = createContext();

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};

export const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("movies_favs") || "[]");
    } catch {
      return [];
    }
  });
  const [filterGenre, setFilterGenre] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // load genres once
    fetchGenres()
      .then(setGenres)
      .catch((e) => console.error("genres error", e));
  }, []);

  useEffect(() => {
    // load popular on mount or page change if no query
    if (query.trim() === "") {
      loadPopular(page);
    } else {
      handleSearch(query, page);
    }
  }, [page]);

  useEffect(() => {
    // persist favorites
    localStorage.setItem("movies_favs", JSON.stringify(favorites));
  }, [favorites]);

  const loadPopular = async (p = 1) => {
    try {
      setLoading(true);
      const data = await fetchPopularMovies(p);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (e) {
      console.error(e);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (q, p = 1) => {
    try {
      setLoading(true);
      const data = await searchMovies(q, p);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (e) {
      console.error(e);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const search = (q) => {
    setQuery(q);
    setPage(1);
    if (q.trim() === "") {
      loadPopular(1);
    } else {
      handleSearch(q, 1);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) return prev.filter((m) => m.id !== movie.id);
      return [...prev, movie];
    });
  };

  const filteredMovies = movies.filter((m) => {
    if (filterGenre === "all") return true;
    return (m.genre_ids || []).includes(Number(filterGenre));
  });

  return (
    <MoviesContext.Provider
      value={{
        movies: filteredMovies,
        rawMovies: movies,
        genres,
        favorites,
        toggleFavorite,
        filterGenre,
        setFilterGenre,
        query,
        setQuery: search,
        loading,
        page,
        setPage,
        totalPages,
        reload: () => loadPopular(1),
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};
