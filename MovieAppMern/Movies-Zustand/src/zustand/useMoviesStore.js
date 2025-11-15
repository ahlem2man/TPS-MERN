import { create } from "zustand";
import { fetchMovies, fetchGenres } from "../api/moviesApi";

export const useMoviesStore = create((set, get) => ({
  movies: [],
  genres: [],
  favorites: [],
  loading: false,
  page: 1,
  totalPages: 1,
  query: "",
  filterGenre: "all",

  loadMovies: async () => {
    const { page, query } = get();
    set({ loading: true });

    const data = await fetchMovies(page, query);
    set({
      movies: data.results,
      totalPages: data.total_pages,
      loading: false,
    });
  },

  loadGenres: async () => {
    const data = await fetchGenres();
    set({ genres: data.genres });
  },

  setQuery: (q) => set({ query: q, page: 1 }),

  setFilterGenre: (g) => set({ filterGenre: g }),

  setPage: (p) => set({ page: p }),

  toggleFavorite: (movie) =>
    set((state) => {
      const exists = state.favorites.some((m) => m.id === movie.id);
      if (exists) {
        return { favorites: state.favorites.filter((m) => m.id !== movie.id) };
      }
      return { favorites: [...state.favorites, movie] };
    }),
}));
