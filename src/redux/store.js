import { configureStore } from "@reduxjs/toolkit";
import loginStatusReducer from "./login/loginSlice.js";
import productsReducer from "./products/products.js"
import loadingReducer from "./loading/loading.js"
import cartReducer from "./cart/cart.js"

export const store = configureStore({
  reducer: {
    loginStatus: loginStatusReducer,
    products:productsReducer,
    isLoading:loadingReducer,
    cartProducts:cartReducer
  },
});
