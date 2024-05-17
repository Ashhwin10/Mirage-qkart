import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useReducer } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loading/loading";
import { useSelector, useDispatch } from "react-redux";
import { setData, registerUser } from "../../redux/register/register";

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isLoading);
  const data = useSelector((state) => state.register);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(setData({ [name]: value }));
  };

  const register = async () => {
    const { username, password } = data;
    if (!validateInput(data)) {
      return;
    }
    try {
      const response = await dispatch(registerUser(username, password));
      if (response.success) {
        enqueueSnackbar("Registered Successfully", { variant: "success" });
        navigate("/login");
      } else {
        enqueueSnackbar("Username not available", { variant: "error" });
      }
    } catch (e) {
      dispatch(setLoading(false));
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const validateInput = (data) => {
    console.log(data)
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
            data-testid = "usernameTextBox"
              id="username"
              label="Username"
              variant="outlined"
              title="Username"
              name="username"
              placeholder="Enter Username"
              fullWidth
              onChange={handleChange}
              // value={data.username}
            />
            <TextField
            data-testid = "passwordTextBox"
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be at least 6 characters long"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
              onChange={handleChange}
              // value={data.password}
            />
            <TextField
            data-testid = "confirmPasswordTextBox"
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              onChange={handleChange}
              // value={data.confirmPassword}
            />
            {isLoading ? (
              <CircularProgress
                size={25}
                style={{ margin: "16px auto 0", marginTop: "20px" }}
              />
            ) : (
              <Button className="button" variant="contained" type="submit"  data-testid = "registerNowButton">
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
