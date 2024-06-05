import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/loading/loading";
import { useSelector, useDispatch } from "react-redux";
import { setData, registerUser } from "../../redux/register/register";
import { validateInput } from "./RegisterValidation";

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
    if (!validateInput(data, enqueueSnackbar)) {
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
              // value={data.username}
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be at least 6 characters long"
              fullWidth
              placeholder="Enter password"
              onChange={handleChange}
              // value={data.password}
            />
            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Enter confirm password"
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
              <Button
                className="button"
                variant="contained"
                type="submit"
                title="registerNowButton"
              >
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
