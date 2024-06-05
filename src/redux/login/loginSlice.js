import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loading/loading";


export const reduxSlice = createSlice({
  name: "loginStatus",
  initialState: { isLoggedIn: false, userData: { username: "", password: "" } },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
    },
    setLoginData: (state, action) => {
      const { username, password } = action.payload;
      state.loginData.username = username;
    },
    setFormData: (state, action) => {
      const { username, password } = action.payload;
      state.userData.username = username;
      state.userData.password = password;
    },
    
  },
});

export const fetchLoginData = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    let data = await response.json();
    let { username, balance } = data.data;
    dispatch(setFormData(username));
    dispatch(setLoading(false));
    return data;
  } catch (e) {
    console.log(e);
  }
};
export const { loginSuccess ,setFormData} = reduxSlice.actions;
export default reduxSlice.reducer;
