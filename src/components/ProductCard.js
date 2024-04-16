import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

// Product card from mui
const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="card-media"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          ${product.price}
        </Typography>
        <Rating value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button
          className="card-button"
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          data-cy="add-to-cart-button" 
        >
          <AddShoppingCartOutlined />
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
