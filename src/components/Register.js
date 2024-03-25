import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useReducer } from "react";
import { createServer, Model } from "miragejs";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

// MirageJS setup
createServer({
  models: {
    user: Model,
  },
  routes() {
    this.post("/api/register", (schema, request) => {
      const requestData = JSON.parse(request.requestBody);
      const newUser = schema.users.create(requestData);
      return newUser;
    });
  },
});

const ACTIONS = {
  SET_DATA: "set-data",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);

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
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({ username, password }),
      });
      setLoading(false);

      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { username: "", password: "", confirmPassword: "" },
      });

      enqueueSnackbar("Registered Successfully", { variant: "success" });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable, and returns valid JSON.",
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
            />
            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              onChange={handleChange}
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
            <p className="secondary-action">Already have an account? </p>
          </Stack>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
