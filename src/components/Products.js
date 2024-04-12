import { Search, SentimentDissatisfied } from "@mui/icons-material";
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
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { Typography } from "@mui/material";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Cart.css";
import { loginSuccess } from "../redux/reduxSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]); //State for the products list
  const [loading, setLoading] = useState(false); // State to update the Loading status
  const [cartItemList, setCartItemList] = useState([]); // State for the cart list

  // API call for fetching the products.
  const performAPICall = async () => {
    setLoading(true);
    try {
      let response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      let data = await response.json();
      setProducts(data.products);
      setLoading(false);
      return data.products;
    } catch (e) {
      // setLoading(false);
      enqueueSnackbar(
        "Something went wrong in fetching of products Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };


  // Implementation of search logic.
  const performSearch = async (text) => {
    let url = `/products/search?value=${text}`;
    try {
      let search = await axios.get(url);
      setProducts(search.data.products);
    } catch (e) {
      if (e.response.status === 404) {
        console.log(e);
      }
    }
  };

  //Debouncing for search functionality

  const debounceSearch = (event, debounceTimeout) => {
    let newtimeout;
    clearTimeout(newtimeout);
    newtimeout = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
  };

  // isLogged in status from redux
  const isLoggedIn = useSelector(loginSuccess);
  let loginStatus = isLoggedIn.payload.loginStatus.isLoggedIn;

  // Use effect for fetching the products when the page renders

  useEffect(() => {
    performAPICall();
  }, []);

  // use effect to set the cartItems
  useEffect(() => {
    fetchCart()
      .then((result) => {
        return generateCartItemsFrom(result, products);
      })
      .then((cartItem) => {
        return setCartItemList(cartItem);
      });
  }, [products]);

  // fetching the cart data
  const fetchCart = async () => {
    if (loginStatus !== true) return;
    try {
      const response = await axios.get("/api/cart");
      return response.data;
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

  // Return if a product already exists in the cart

  const isItemInCart = (items, productId) => {
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === productId) {
        return true;
      }
    }
    return false;
  };

  //  Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart

  const addToCart = async (
    items,
    products,
    productId,
    qty,
    id,
    name,
    options = { preventDuplicate: false }
  ) => {
    if (loginStatus !== true) {
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
      const response = await axios.post("/api/cart", {
        productId,
        qty,
        id,
        name,
      });
      const data = response.data;
      const nCartItemList = generateCartItemsFrom(data, products);
      setCartItemList(nCartItemList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          fullWidth
          size="small"
          sx={{ width: "35%" }}
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
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
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
            {loading === true ? (
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
        {loginStatus === true && (
          <Grid
            container
            item
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
