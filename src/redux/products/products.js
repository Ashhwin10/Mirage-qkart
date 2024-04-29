import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { isLoadingTrue,isLoadingFalse } from "../loading/loading";

export const productsSlice = createSlice({
  name: "products",
  initialState: { products:[]},
  reducers: {
    setProducts: (state, action) => {
      state.products=action.payload;
    },

  },
  
});

export const performApiCall = () => async (dispatch) => {
  dispatch(isLoadingTrue()) 
  try {
    dispatch(fetchProducts());
    dispatch(isLoadingFalse());
  } catch (e) {
  console.log(e)
  }
}

export const fetchProducts = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/products');
    dispatch(setProducts(data.products)); 
  } catch (e) {
   console.log(e)
  }
};

export const fetchProductsToCheckout = () => async (dispatch) => {
    const { data } = await axios.get('/api/products');
    return data.products;
};
export const { setProducts, getProducts } = productsSlice.actions;
export default productsSlice.reducer;
