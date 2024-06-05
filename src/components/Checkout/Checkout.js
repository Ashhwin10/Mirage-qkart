import { CreditCard } from "@mui/icons-material";
import { Button, Divider, Grid, Box, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cart, { getTotalCartValue, getTotalItems } from "../Cart/Cart";
import { generateCartItemsFrom } from "../Products/Products";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { AddNewAddressView } from "../Address/Address";
import {
  setItems,
  setSelectedAddress,
  addressInputOn,
  addNewAddress,
  deleteAddresses,
  performFinalCheckout,
} from "../../redux/addresses/addresses";
import "./Checkout.css";
import { validateRequest } from "./CheckoutValidation";

export const performCheckout = async (
  items,
  addresses,
  dispatch,
  navigate,
  enqueueSnackbar
) => {
  if (validateRequest(items, addresses, enqueueSnackbar)) {
    try {
      dispatch(performFinalCheckout(items, addresses));
      localStorage.setItem(
        "balance",
        localStorage.getItem("balance") - getTotalCartValue(items)
      );
      enqueueSnackbar("Order placed successfully", { variant: "success" });
      navigate("/thanks");
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  }
};

const Checkout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { newAddress, addresses, products, items } = useSelector((state) => ({
    newAddress: state.address.newAddress,
    addresses: state.address.addresses,
    products: state.products.products,
    items: state.address.items,
  }));
  console.log(items);
  const getProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      return data.products;
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong in fetching products in checkout page. Check that the backend is running, reachable, and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart");
      return data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details in checkout page. Check that the backend is running, reachable, and returns valid JSON.",
          { variant: "error" }
        );
      }
      return null;
    }
  };

  const addAddress = async () => {
    try {
      dispatch(addNewAddress());
    } catch (e) {
      enqueueSnackbar(
        "Could not add this address. Check that the backend is running, reachable, and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      dispatch(deleteAddresses(addressId));
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable, and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();
      const cartData = await fetchCart();

      if (productsData && cartData) {
        const cartDetails = generateCartItemsFrom(cartData, productsData);
        dispatch(setItems(cartDetails));
      }
    };
    onLoadHandler();
  }, [dispatch]);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {addresses.all.length > 0 ? (
                addresses.all.map((e) => (
                  <Box
                    data-cy="select-address"
                    className={`address-item ${
                      addresses.selected === e.id ? `selected` : `not-selected`
                    }`}
                    onClick={() => dispatch(setSelectedAddress(e.id))}
                    key={e.id}
                  >
                    <Typography data-testid="addresses">{e.address}</Typography>
                    <Button
                      data-cy="delete-address"
                      onClick={() => deleteAddress(e.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to
                  proceed.
                </Typography>
              )}
            </Box>
            {newAddress.isAddingNewAddress !== true ? (
              <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  dispatch(addressInputOn());
                }}
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                newAddress={newAddress}
                addAddress={addAddress}
              />
            )}
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />
            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>
            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() =>
                performCheckout(
                  items,
                  addresses,
                  dispatch,
                  navigate,
                  enqueueSnackbar
                )
              }
              data-cy="place-order"
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
          <Box className="cart" p={1.5}>
            <h2>Order Details</h2>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <h4>Products</h4>
                <h4>Subtotal</h4>
                <h4>Shipping Charges</h4>
                <h3>Total</h3>
              </Box>
              <Box>
                <h4>{getTotalItems(items)}</h4>
                <h4>${getTotalCartValue(items)}</h4>
                <h4>$0</h4>
                <h3>${getTotalCartValue(items)}</h3>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
