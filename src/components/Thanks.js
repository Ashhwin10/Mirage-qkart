import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Thanks.css";
import axios from "axios";

const Thanks = () => {
  const navigate = useNavigate();

  const routeToProducts = () => {
    navigate("/");
  };
  // Function to clear the cart after placing an order.
  const clearCart = async () => {
    try {
      const response = await axios.post("/api/clearcart");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Header />
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">${localStorage.getItem("balance")} Available</p>
        <Button
          variant="contained"
          size="large"
          id="continue-btn"
          data-cy="Continue Shopping"
          onClick={() => {
            clearCart();
            routeToProducts();
          }}
        >
          Continue Shopping
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;
