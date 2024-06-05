import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register.js";
import Login from "./components/Login/Login.js";
import { MirageSetup } from "./mirage/mirage.js";
import Products from "./components/Products/Products.js";
import Checkout from "./components/Checkout/Checkout.js";
import Thanks from "./components/Thanks/Thanks.js";
import Favorites from "./components/Favorites/Favorites.js";

MirageSetup();

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Products />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thanks" element={<Thanks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
