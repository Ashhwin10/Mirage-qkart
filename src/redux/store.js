import { configureStore } from "@reduxjs/toolkit";
import loginStatusReducer from "../redux/reduxSlice.js";

export const store = configureStore({
  reducer: {
    loginStatus: loginStatusReducer,
  },
});
