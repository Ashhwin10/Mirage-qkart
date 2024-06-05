import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Checkout from "./Checkout";
import { MirageSetup } from "../../mirage/mirage";

const mockStore = configureMockStore();

describe("checkout page", () => {
  const initialState = {
    address: {
      newAddress: {
        isAddingNewAddress: true,
        address: "",
      },
      items: [
        {
          id: 1,
          name: "iPhone 9",
          price: 549,
          rating: 4.69,
          image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        },
      ],
      addresses: {
        all: [
          { address: "No 10 green street chennai-12345", id: "1" },
          { address: "No 15 blue street bangalore-67890", id: "2" },
        ],
        selected: "",
      },
    },
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
  };

  const setup = (state = initialState) => {
    let store = mockStore(state);
    return render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Checkout />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
  };

  let server;
  beforeEach(() => {
    server = MirageSetup({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Check if elements are rendering", () => {
    setup();
    expect(
      screen.getByRole("button", { name: /PLACE ORDER/i })
    ).toBeInTheDocument();
  });

  it("Clicking place order without selecting a address", () => {
    setup();
    const button = screen.getByRole("button", { name: /PLACE ORDER/i });
    fireEvent.click(button);
    expect(
      screen.getByText(/Please select one shipping address to proceed./i)
    ).toBeInTheDocument();
  });

  it("test if a address is getting selected", () => {
    setup();
    const address = screen.getByText(/No 10 green street chennai-12345/i);
    fireEvent.click(address);
    expect(address).toHaveStyle({ color: "##00a278" });
  });

  it("Show textfield when isAddingNewAddress is true ", () => {
    setup();
    expect(
      screen.getByPlaceholderText("Enter your complete address")
    ).toBeInTheDocument();
  });

  it("Checking with empty address", () => {
    const initialStateEmpty = {
      address: {
        newAddress: {
          isAddingNewAddress: false,
          address: "",
        },
        items: [],
        addresses: {
          all: [],
          selected: "",
        },
      },
      products: initialState.products,
    };
    setup(initialStateEmpty);
    const button = screen.getByRole("button", { name: /PLACE ORDER/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(
      screen.getByText(/Please add a new address before proceeding./i)
    ).toBeInTheDocument();
  });

  it("check if add addresses function from redux is called", async () => {
    setup();
    const addAddressSpy = jest.spyOn(
      require("../../redux/addresses/addresses"),
      "addNewAddress"
    );
    fireEvent.change(
      screen.getByPlaceholderText("Enter your complete address"),
      { target: { value: "No 10 , Vishal street, Chennai - 600102" } }
    );
    const button = screen.getByRole("button", { name: /ADD/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(addAddressSpy).toHaveBeenCalled();
    });
    addAddressSpy.mockRestore();
  });

  it("Check if delete address function is called on adding a address", async () => {
    setup();
    const deleteAddressSpy = jest.spyOn(
      require("../../redux/addresses/addresses"),
      "deleteAddresses"
    );
    const button = screen.getAllByRole("button", { name: /Delete/i });
    fireEvent.click(button[0]);

    await waitFor(() => {
      expect(deleteAddressSpy).toHaveBeenCalled();
    });
  });
  it("check if validateRequest is called when placeOrder is clicked", async () => {
    setup();
    const validateRequestSpy = jest.spyOn(
      require("./CheckoutValidation"),
      "validateRequest"
    );
    const address = screen.getByText(/No 10 green street chennai-12345/i);
    fireEvent.click(address);
    const button = screen.getByRole("button", { name: /PLACE ORDER/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(validateRequestSpy).toHaveBeenCalled();
    });
  });
  it("check if performcheckout is called when Placeorder button is clicked", async () => {
    setup();
    const validateRequestSpy = jest
      .spyOn(require("./CheckoutValidation"), "validateRequest")
      .mockImplementation(() => {
        return true;
      });
    const performCheckoutSpy = jest.spyOn(
      require("../../redux/addresses/addresses"),
      "performFinalCheckout"
    );
    const button = screen.getByRole("button", { name: /PLACE ORDER/i });
    fireEvent.click(button);
    await waitFor(() => {
      // expect(validateRequestSpy).toHaveBeenCalled();
      expect(performCheckoutSpy).toHaveBeenCalled();
    });
  });
});
