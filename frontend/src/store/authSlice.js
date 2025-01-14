import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true, // Added loading state
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      window.localStorage.setItem("user", JSON.stringify(action.payload));
    },
    removeUser: (state) => {
      state.user = null;
      state.loading = false;
      window.localStorage.removeItem("user");
    },
    setUserFromLocalStorage: (state) => {
      const user = window.localStorage.getItem("user");
      state.user = user ? JSON.parse(user) : null;
      state.loading = false; // Mark loading as complete
    },
  },
});

export const { setUser, removeUser, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
