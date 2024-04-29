import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useReducer } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isLoadingFalse, isLoadingTrue } from "../../redux/loading/loading";
import { useSelector, useDispatch } from "react-redux";

const ACTIONS = {
  SET_DATA: "set-data",
  CLEAR_DATA: "clear-data",
};


function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return { ...state, ...action.payload };
    case ACTIONS.CLEAR_DATA:
      return { username: "", password: "", confirmPassword: "" };
    default:
      return state;
  }
}

const Register = () => {
  const dispatchh = useDispatch();
  const loading = useSelector((state)=> state.isLoading.isLoading)
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
    confirmPassword: "",
  }); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: ACTIONS.SET_DATA, payload: { [name]: value } });
  };
  
  const register = async () => {
    const { username, password, confirmPassword } = state;
    if (!validateInput(state)) {
      return;
    }
    try {
      dispatchh(isLoadingTrue())
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      dispatchh(isLoadingFalse())

      dispatch({
        type: ACTIONS.CLEAR_DATA
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success) {
          enqueueSnackbar("Registered Successfully", { variant: "success" });
          navigate("/login");
        } else {
          enqueueSnackbar("Username not available", { variant: "error" });
        }
      }
    } catch (e) {
      dispatchh(isLoadingFalse())
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be more than 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be more than 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;
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
            register();
          }}
        >
          <Stack spacing={2}>
            <h2 className="title">Register</h2>
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
              helperText="Password must be at least 6 characters long"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
              onChange={handleChange}
              value={state.password}
            />
            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              onChange={handleChange}
              value={state.confirmPassword}
            />
            {loading ? (
              <CircularProgress
                size={25}
                style={{ margin: "16px auto 0", marginTop: "20px" }}
              />
            ) : (
              <Button className="button" variant="contained" type="submit">
                Register Now
              </Button>
            )}
            <p className="secondary-action">
              Already have an account?{" "}
              <Link className="link" to="/login">
                Login here
              </Link>
            </p>
          </Stack>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
