import { createSlice } from "@reduxjs/toolkit";

export const onlinestatus = createSlice({
  name: "onlinestatus",
  initialState: {
    isOnline: navigator.onLine, // initial state based on current browser status
  },
  reducers: {
    goOnline: (state) => {
      state.isOnline = true;
    },
    goOffline: (state) => {
      state.isOnline = false;
    },
  },
});

export const { goOnline, goOffline } = onlinestatus.actions;

export default onlinestatus.reducer;
