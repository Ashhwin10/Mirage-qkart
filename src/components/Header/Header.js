import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";


const Header = ({ children, hasHiddenAuthButtons }) => {
  const navigate = useNavigate();

  let removeItem = () => {
    localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {}, []);

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => navigate("/")}
          data-cy="Explore-header"
        >
          Back to explore
        </Button>
      ) : !localStorage.username ? (
        <Box>
          <Stack direction="row" spacing={1}>
            <Button  data-cy="Login-header" onClick={() => navigate("/login")}>LOGIN</Button>
            <Button   data-cy="Register-header" onClick={() => navigate("/register")}>REGISTER</Button>
          </Stack>
        </Box>
      ) : (
        <div className="username-text">
          <Stack direction="row" spacing={1}>
            <Avatar src="avatar.png" alt={localStorage.username} />
            <div className="username">{localStorage.username}</div>
            <Button data-cy="Logout-header" className="logoutbutton" onClick={removeItem}>
              LOGOUT
            </Button>
          </Stack>
        </div>
      )}
    </Box>
  );
};

export default Header;
