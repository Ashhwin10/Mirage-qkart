import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cartProducts",
  initialState: { cartItemList:[] },
  reducers: {
    setCartProducts: (state, action) => {
      state.cartItemList=action.payload;
    },
  },
});

export const { setCartProducts } = cartSlice.actions;
export default cartSlice.reducer;
