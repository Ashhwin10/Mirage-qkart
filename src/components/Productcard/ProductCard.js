import { AddShoppingCartOutlined } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
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

const ProductCard = ({ product, handleAddToCart, handleFavorites }) => {
  const [fav, SetFav] = useState(false);
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
          data-testid="addToCart"
        >
          <AddShoppingCartOutlined />
          ADD TO CART
        </Button>
        <Button
          onClick={() => {
            SetFav(!fav);
          }}
        >
          {fav ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon color="error" />
          )}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
