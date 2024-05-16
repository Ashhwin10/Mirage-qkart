import { Search } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer.js";
import Header from "../Header/Header.js";
import "./Products.css";
import ProductCard from "../Productcard/ProductCard.js";
import { Typography } from "@mui/material";
import Cart from "../Cart/Cart.js";
import "../Cart/Cart.css";
import { setProducts, performApiCall } from "../../redux/products/products.js";
import { setCartProducts, fetchCartData } from "../../redux/cart/cart.js";
import { useDispatch, useSelector } from "react-redux";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) {
    return [];
  }

  const cartItems = [];
  const cartArray = cartData.cart.items;

  for (let i = 0; i < cartArray.length; i++) {
    for (let j = 0; j < productsData.length; j++) {
      const cartProduct = cartArray[i];
      const product = productsData[j];

      if (cartProduct.qty > 0 && cartProduct.productId === product.id) {
        const cartItem = { ...product, qty: cartProduct.qty };
        cartItems.push(cartItem);
      }
    }
  }

  return cartItems;
};


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [searching, setsearching] = useState(false);
  const { isLoading, products, cartItemList, isLoggedIn } = useSelector(
    (state) => ({
      isLoading: state.isLoading.isLoading,
      products: state.products.products,
      cartItemList: state.cartItemList.cartItemList,
      isLoggedIn: state.isLoggedIn.isLoggedIn,
    })
  );

  const performAPICall = async () => {
    try {
      dispatch(performApiCall());
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong in fetching of products Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const performSearch = async (text) => {
    let url = `/products/search?value=${text}`;
    try {
      let { data } = await axios.get(url);
      dispatch(setProducts(data.products));
    } catch (e) {
      if (e.response.status === 404) {
        console.log(e);
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    let newtimeout;
    setsearching(true);
    clearTimeout(newtimeout);
    newtimeout = setTimeout(() => {
      performSearch(event.target.value);
      setsearching(false);
    }, debounceTimeout);
  };

  const fetchCart = async () => {
    if (isLoggedIn !== true) return;
    try {
      dispatch(fetchCartData());
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === productId) {
        return true;
      }
    }
    return false;
  };


  const addToCart = async (
    items,
    products,
    productId,
    qty,
    id,
    name,
    options = { preventDuplicate: false }
  ) => {
    if (isLoggedIn !== true) {
      enqueueSnackbar("Login to add item to the Cart", { variant: "Warning" });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    try {
      const { data } = await axios.post("/api/cart", {
        productId,
        qty,
        id,
        name,
      });
      const nCartItemList = generateCartItemsFrom(data, products);
      dispatch(setCartProducts(nCartItemList));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart()
      .then((result) => {
        return generateCartItemsFrom(result, products);
      })
      .then((cartItems) => {
        dispatch(setCartProducts(cartItems));
      });
  }, [products]);

  return (
    <div>
      <Header className="searchBox">
        <TextField
          id="1122"
          className="search-desktop"
          fullWidth
          data-cy="searchbox"
          size="small"
          sx={{ width: "35%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <React.Fragment>
                  {searching ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Search color="primary" />
                  )}
                </React.Fragment>
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, 500)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        data-cy="searchbox"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, 500)}
      />
      <Grid container>
        <Grid item xs md>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {/* <ProductCard /> */}

          <Grid container>
            {isLoading === true ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress size={25} />
                <Typography gutterBottom variant="p" component="div">
                  Loading Products...
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                item
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
                my={3}
              >
                {products !== "empty" ? (
                  products.map((item) => (
                    <Grid item key={item.id} xs={6} md={3}>
                      <ProductCard
                        product={item}
                        handleAddToCart={async () => {
                          await addToCart(
                            cartItemList,
                            products,
                            item.id,
                            1,
                            item.id,
                            item.name,
                            { preventDuplicate: true }
                          );
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <h3>No products found</h3>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
        {isLoggedIn === true && (
          <Grid
            container
            item
            data-cy="Cart-details"
            className="product-grid"
            xs={12}
            md={3}
            sx={{ border: `1px solid black`, backgroundColor: `#E9F5E1` }}
          >
            <Cart
              products={products}
              items={cartItemList}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
