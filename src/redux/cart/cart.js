import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const cartSlice = createSlice({
  name: "cartProducts",
  initialState: { cartItemList: [] },
  reducers: {
    setCartProducts: (state, action) => {
      state.cartItemList = action.payload;
    },
    getCart: (state, action) => {
      state.cartItemList = action.payload;
    },
  },
});

export const fetchCartData = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/cart");
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const { setCartProducts } = cartSlice.actions;
export default cartSlice.reducer;
