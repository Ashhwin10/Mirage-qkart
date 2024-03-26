import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
 

  const login = async (formData) => {
    if (!validateInput(formData)) return;
    try {

      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = response.json;

      let { username, success, token, balance } = data;
      // console.log(username,success,token,balance)

      setFormData({
        username: "",
        password: "",
      });

      setLoading(false);
      enqueueSnackbar("logged in successfully", { variant: "success" });
      if (success) {
        persistLogin(token, username, balance);
      }
      navigate("/Products");
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" },
        );
      }
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("username is a required field", { variant: "warning" });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("password is a  required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
            value={formData.username}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
            value={formData.password}
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => login(formData)}
          >
            LOGIN TO QKART
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;