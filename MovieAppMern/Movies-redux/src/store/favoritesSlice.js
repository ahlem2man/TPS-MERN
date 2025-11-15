import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("favs") || "[]");

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const exists = state.find((m) => m.id === action.payload.id);
      let updated;
      if (exists) {
        updated = state.filter((m) => m.id !== action.payload.id);
      } else {
        updated = [...state, action.payload];
      }
      localStorage.setItem("favs", JSON.stringify(updated));
      return updated;
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
