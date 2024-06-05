import { Box } from "@mui/material";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Favorites = () => {
  return (
    <>
      <Header hasHiddenAuthButtons />
      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span> to
          your door step
        </p>
      </Box>
      <Footer />
    </>
  );
};
export default Favorites;
