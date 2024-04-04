import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import { MirageSetup } from "./Mirage.js";
import Products from "./components/Products";
import Checkout from "./components/checkout";
import Thanks from "./components/Thanks";


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
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/thanks" element={<Thanks/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
