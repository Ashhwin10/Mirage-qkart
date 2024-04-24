import { CreditCard } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cart, {
  getTotalCartValue,
  generateCartItemsFrom,
  getTotalItems,
} from "../Cart/Cart";
import "./Checkout.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";


const AddNewAddressView = ({ newAddress, handleNewAddress, addAddress }) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        data-cy="address-textbox"
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        onChange={(e) => {
          handleNewAddress({ isAddingNewAddress: true, value: e.target.value });
        }}
      />
      <Stack direction="row" my="1rem">
        <Button
          data-cy="add-new-btn"
          variant="contained"
          onClick={() => addAddress(newAddress)}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={(e) => {
            handleNewAddress({
              isAddingNewAddress: false,
              value: "",
            });
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });
  const [getAddress, SetGetAddress] = useState([]);

 
  const getProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
      return data.products;
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong in fetching of products in checkout page. Check that the backend is running, reachable and returns valid JSON.",
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
          "Could not fetch cart details in checkout page . Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  
  const getAddresses = async () => {
    try {
      const { data } = await axios.get("/api/checkout/addresses");

      setAddresses({ ...addresses, all: data });
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  
  const addAddress = async (newAddress) => {
    try {
      const { data } = await axios.post("/api/checkout/addresses", {
        address: newAddress.value,
      });
      setAddresses({ ...addresses, all: data });
      SetGetAddress(data);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };
  
  const deleteAddress = async (addressId) => {
    try {
      const url = `/api/checkout/addresses/${addressId}`;
      const { data } = await axios.delete(url);
      setAddresses({ ...addresses, all: data });
      SetGetAddress(data);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  
  const validateRequest = (items, addresses) => {
    if (localStorage.getItem("balance") < getTotalCartValue(items)) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }

    if (!addresses.selected.length) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };

  
  const performCheckout = async (items, addresses) => {
    if (validateRequest(items, addresses)) {
      try {
        const { data } = await axios.post(
          "/api/finalcheckout",
          { items, addresses },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
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

  
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart();

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
  }, []);

  
  useEffect(() => {
    getAddresses();
  }, [getAddress]);

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
                addresses.all.map((e) => {
                  return (
                    <Box
                      data-cy="select-address"
                      className={`address-item ${
                        addresses.selected === e.id
                          ? `selected`
                          : `not-selected`
                      }`}
                      onClick={(eve) =>
                        setAddresses({ ...addresses, selected: e.id })
                      }
                      key={e.id}
                    >
                      <Typography>{e.address}</Typography>
                      <Button
                        data-cy="delete-address"
                        onClick={() => deleteAddress(e.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
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
                  setNewAddress((currNewAddress) => ({
                    ...currNewAddress,
                    isAddingNewAddress: true,
                  }));
                }}
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
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
              onClick={(e) => performCheckout(items, addresses)}
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
