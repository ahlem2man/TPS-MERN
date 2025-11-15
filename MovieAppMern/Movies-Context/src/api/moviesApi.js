const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch error: " + res.status);
  return res.json();
}

export async function fetchPopularMovies(page = 1) {
  const url = `${BASE}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`;
  const data = await fetchJson(url);
  return data; 
}

export async function fetchGenres() {
  const url = `${BASE}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`;
  const data = await fetchJson(url);
  return data.genres || [];
}

export async function searchMovies(query, page = 1) {
  const url = `${BASE}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`;
  const data = await fetchJson(url);
  return data;
}
