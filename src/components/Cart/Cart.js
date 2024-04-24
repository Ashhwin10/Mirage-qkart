import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.js";

// Function to generate the cart items
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



export const getTotalCartValue = (items = []) => {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const totalQty = items[i].qty;
    const totalCost = items[i].price;
    let totalValue = totalCost * totalQty;
    total += totalValue;
  }
  return total;
};


export const getTotalItems = (items = []) => {
  return items.length;
};


const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}  data-cy="remove">
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty" className="cart-item"  data-cy="qty-value">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}  data-cy="add">
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};


const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Box className="cart">
          {items.map((e, inx) => {
            return (
              <Box
                display="flex"
                key={inx}
                alignItems="flex-start"
                padding="1rem"
              >
                <Box className="image-container">
                  <img src={e.image} alt={e.name} width="100%" height="100%" />
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div className="cart-item">{e.name}</div>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {isReadOnly ? (
                      <p className="cart-item">Qty: {e.qty}</p>
                    ) : (
                      <ItemQuantity
                        value={e.qty}
                        handleAdd={() =>
                          handleQuantity(
                            items,
                            products,
                            e.id,
                            e.qty ? e.qty + 1 : 1
                          )
                        }
                        handleDelete={() =>
                          handleQuantity(
                            items,
                            products,
                            e.id,
                            e.qty ? e.qty - 1 : 1
                          )
                        }
                      />
                    )}
                    <Box padding="0.5rem" fontWeight="700">
                      <div className="cart-item">${e.price}</div>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          {!isReadOnly ? (
            <Box
              display="flex"
              justifyContent="flex-end"
              className="cart-footer"
            >
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                data-cy="checkout"
                onClick={() => {
                  navigate("/checkout");
                }}
              >
                Checkout
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  }
};

export default Cart;
