import { configureStore } from "@reduxjs/toolkit";
import loginStatusReducer from "./login/loginSlice.js";
import productsReducer from "./products/products.js"
import loadingReducer from "./loading/loading.js"
import cartReducer from "./cart/cart.js"
import addressReducer from "./addresses/addresses.js"

export const store = configureStore({
  reducer: {
    isLoggedIn: loginStatusReducer,
    products:productsReducer,
    isLoading:loadingReducer,
    cartItemList:cartReducer,
    address:addressReducer
  },
});
