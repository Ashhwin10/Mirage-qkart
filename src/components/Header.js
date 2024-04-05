import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

// Header of the page

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
        >
          Back to explore
        </Button>
      ) : !localStorage.username ? (
        <Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => navigate("/login")}>LOGIN</Button>
            <Button onClick={() => navigate("/register")}>REGISTER</Button>
          </Stack>
        </Box>
      ) : (
        <div className="username-text">
          <Stack direction="row" spacing={1}>
            <Avatar src="avatar.png" alt={localStorage.username} />
            <div className="username">{localStorage.username}</div>
            <Button className="logoutbutton" onClick={removeItem}>
              LOGOUT
            </Button>
          </Stack>
        </div>
      )}
    </Box>
  );
};

export default Header;
