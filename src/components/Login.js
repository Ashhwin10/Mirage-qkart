import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useState , useReducer } from "react";
import { useHistory, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import { useDispatch, useSelector } from 'react-redux';
import {loginSuccess} from "../redux/reduxSlice.js";


const ACTIONS = {
SET_FORMDATA:"set-formdata"
}


function reducer(state,action){
switch(action.type) {
  case ACTIONS.SET_FORMDATA:
    return{...state,...action.payload};
    default:
    return state;
}
}
const Login = () => {
  const dispatchh = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer,{username: "", password: ""});
  // const [formData, setFormData] = useState({ username: "", password: "" });
  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: ACTIONS.SET_FORMDATA, payload: { [name]: value } });
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

      let data = await response.json();
      console.log("data",data)

      let { username, balance } = data.data;
      console.log(username,balance)
      

      dispatch({type:ACTIONS.SET_FORMDATA});

      setLoading(false);
      
      if (data.success) {
        enqueueSnackbar("logged in successfully", { variant: "success" });
        persistLogin(data.data.username, data.data.balance);
        dispatchh(loginSuccess())
        navigate("/");
      } else {
        enqueueSnackbar("User not registered", { variant: "error" });
      }
      
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

  const persistLogin = (username, balance) => {
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
        
      
          <form 
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            login();
            }}>
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
            value={state.username}
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
            value={state.password}
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => login(state)}
          >
            LOGIN TO QKART
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
