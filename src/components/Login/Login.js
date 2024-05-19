import { Button,Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import Header from "../Header/Header.js";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess,setFormData,fetchLoginData } from "../../redux/login/loginSlice.js";
import { setLoading } from "../../redux/loading/loading.js";



const Login = () => {
  const dispatchh = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const readData = useSelector((state) => state.isLoggedIn.userData)
  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatchh(setFormData({ ...readData, [name]: value }));
};


  const login = async (formData) => {
    if (!validateInput(formData)) return;
    try {
      

      const data = await dispatchh (fetchLoginData(formData));
      let { username, balance } = data.data;
      if (data.success) {
        enqueueSnackbar("logged in successfully", { variant: "success" });
        persistLogin(username, balance);
        dispatchh(loginSuccess());
        navigate("/");
      } else {
        enqueueSnackbar("User not registered", { variant: "error" });
      }
    } catch (e) {
      dispatchh(setLoading(false));
      enqueueSnackbar("Invalid username or password", { variant: "error" });
    }
  };

  
  const validateInput = (data) => {
    console.log("data",data)
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
          }}
        >
          <Stack spacing={2} className="form">
            <h2 className="title">Login</h2>
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
              // value={state.username}
            />
            <TextField
             data-testid = "passwordTextBox"
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be atleast 6 characters length"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
              onChange={handleChange}
              // value={state.password}
            />
            <Button
             data-testid = "loginButton"
              className="button"
              variant="contained"
              onClick={() => login(readData)} 
              data-cy="Login"
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
