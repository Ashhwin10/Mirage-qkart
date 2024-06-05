import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Products from "./Products";
import { MirageSetup } from "../../mirage/mirage";
import thunk from "redux-thunk";
import mockAxios from "axios";

jest.mock("axios");

const mockStore = configureMockStore(thunk);

describe("Products page", () => {
  let server;

  const initialState = {
    isLoading: { isLoading: false },
    products: {
      products: [
        {
          id: 1,
          name: "iPhone 9",
          price: 549,
          rating: 4.69,
          image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        },
        {
          id: 2,
          name: "iPhone X",
          price: 899,
          rating: 4.44,
          image: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
        },
        {
          id: 3,
          name: "Samsung Universe 9",
          price: 1249,
          rating: 4.09,
          image: "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
        },
        {
          id: 4,
          name: "OPPOF19",
          price: 280,
          rating: 4.3,
          image: "https://cdn.dummyjson.com/product-images/4/thumbnail.jpg",
        },
      ],
    },
    cartItemList: {
      cartItemList: [
        {
          id: 1,
          name: "iPhone 9",
          price: 549,
          qty: 1,
          rating: 4.69,
          image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        },
      ],
    },
    isLoggedIn: { isLoggedIn: true },
  };

  const setup = (state = initialState) => {
    let store = mockStore(state);
    return render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Products />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
  };

  beforeEach(() => {
    server = MirageSetup({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("should render elements", () => {
    setup();
    expect(
      screen.getByPlaceholderText(/Search for items\/categoies/i)
    ).toBeInTheDocument();

    screen.getAllByTestId("addqty").forEach((button) => {
      expect(button).toBeInTheDocument();
    });
    screen.getAllByTestId("removeqty").forEach((b) => {
      expect(b).toBeInTheDocument();
    });
    screen.getAllByTestId("products").forEach((button) => {
      expect(button).toBeInTheDocument();
    });
    expect(screen.getAllByTestId("products")).toHaveLength(4);
  });

  it("check if items already in cart", async () => {
    setup();
    const addToCartButton = screen
      .getAllByTestId("products")[0]
      .querySelector("button");
    fireEvent.click(addToCartButton);
    await waitFor(() => {
      expect(
        screen.getByText(
          "Item already in cart. Use the cart sidebar to update quantity or remove item."
        )
      ).toBeInTheDocument();
    });
  });

  it("should not show cart details and handle add to cart when not logged in", async () => {
    const stateNotLoggedIn = {
      ...initialState,
      isLoggedIn: { isLoggedIn: false },
    };
    setup(stateNotLoggedIn);
    expect(screen.queryByTestId("Cart-details")).not.toBeInTheDocument();
    const addToCartButton = screen
      .getAllByTestId("products")[0]
      .querySelector("button");
    fireEvent.click(addToCartButton);
    await waitFor(() =>
      expect(
        screen.queryByText(/Login to add item to the Cart/i)
      ).toBeInTheDocument()
    );
  });

  it("Should call function when addqty button is clicked", async () => {
    setup();
    const pdtSpy = jest.spyOn(
      require("../../redux/cart/cart"),
      "setCartProducts"
    );
    const addButton = screen.getByTestId("addqty");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(pdtSpy).toHaveBeenCalled();
    });
    pdtSpy.mockRestore();
  });

  it("Should call function when removeqty button is clicked", async () => {
    setup();
    const pdtSpy = jest.spyOn(
      require("../../redux/cart/cart"),
      "setCartProducts"
    );
    const addButton = screen.getByTestId("removeqty");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(pdtSpy).toHaveBeenCalled();
    });
    pdtSpy.mockRestore();
  });
  it("Check if a function is called when a product is added", async () => {
    setup();
    const pdtSpy = jest.spyOn(
      require("../../redux/cart/cart"),
      "setCartProducts"
    );
    const product = screen.getAllByTestId("products")[3];
    const addToCartButton = within(product).getByTestId("addToCart");

    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(pdtSpy).toHaveBeenCalled();
    });
    pdtSpy.mockRestore();
  });

  it("check if a correct endpoint is called when Add To Cart button is clicked", async () => {
    const mockPost = mockAxios.post.mockResolvedValue({
      items: [{ productId: 4, qty: 1, name: "OPPOF19" }],
    });
    setup();

    const product = screen.getAllByTestId("products")[3];
    const addToCartButton = within(product).getByTestId("addToCart");

    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/api/cart", {
        id: 4,
        name: "OPPOF19",
        productId: 4,
        qty: 1,
      });
    });
  });
});
