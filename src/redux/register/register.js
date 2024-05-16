import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loading/loading";

const registerSlice = createSlice({
  name: "register",
  initialState: {
    username: "",
    password: "",
    confirmPassword: "",
  },
  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const registerUser = ( username, password ) => async (dispatch) => {
  try {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      dispatch(setLoading(false));
      const resJson = await response.json();
      return resJson;
  } catch (e) {
    console.log(e);
  }
};

export const { setData } = registerSlice.actions;
export default registerSlice.reducer;
