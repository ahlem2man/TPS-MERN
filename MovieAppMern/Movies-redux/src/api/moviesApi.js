import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "fr-FR",
  },
});

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export const fetchPopularMovies = (page = 1) =>
  api.get("/movie/popular", { params: { page } }).then((res) => res.data);

export const fetchSearchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page } }).then((res) => res.data);

export const fetchGenres = () =>
  api.get("/genre/movie/list").then((res) => res.data.genres);
