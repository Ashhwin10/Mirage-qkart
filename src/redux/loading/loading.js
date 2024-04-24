import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "isLoading",
  initialState: { isLoading: false },
  reducers: {
    isLoadingTrue: (state, action) => {
      state.isLoading = true;
    },isLoadingFalse: (state, action) => {
        state.isLoading = false;
      },
  },
});

export const { isLoadingTrue, isLoadingFalse} = loadingSlice.actions;
export default loadingSlice.reducer;
