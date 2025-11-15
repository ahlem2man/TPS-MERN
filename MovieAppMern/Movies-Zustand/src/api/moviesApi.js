const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export async function fetchMovies(page = 1, query = "") {
  const url =
    query.trim() === ""
      ? `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
      : `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

  const res = await fetch(url);
  return res.json();
}

export async function fetchGenres() {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
}
