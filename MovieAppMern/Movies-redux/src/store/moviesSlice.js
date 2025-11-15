import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPopularMovies, fetchSearchMovies, fetchGenres } from "../api/moviesApi";

// Fetch genres once
export const loadGenres = createAsyncThunk("movies/genres", async () => {
  return await fetchGenres();
});

// Fetch popular movies
export const loadPopularMovies = createAsyncThunk("movies/popular", async (page) => {
  return await fetchPopularMovies(page);
});

// Search movies
export const searchMovies = createAsyncThunk("movies/search", async ({ query, page }) => {
  return await fetchSearchMovies(query, page);
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    genres: [],
    page: 1,
    totalPages: 1,
    query: "",
    filterGenre: "all",
    loading: false,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
      state.page = 1;
    },
    setFilterGenre: (state, action) => {
      state.filterGenre = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Genres
      .addCase(loadGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      // Popular
      .addCase(loadPopularMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPopularMovies.fulfilled, (state, action) => {
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.loading = false;
      })
      // Search
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.loading = false;
      });
  },
});

export const { setPage, setQuery, setFilterGenre } = moviesSlice.actions;
export default moviesSlice.reducer;
