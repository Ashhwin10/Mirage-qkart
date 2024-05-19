import { render, waitFor } from "@testing-library/react";
import Login from "../components/Login/Login";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import store from "../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MirageSetup } from "../mirage/mirage";

describe("Login page", () => {
  let server;

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => {
          if (key === "isLoggedIn") return "true";
          if (key === "balance") return "5000"; // Set any other items as needed
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    server = MirageSetup({ environment: "test" });

    render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Login />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
  });

  afterEach(() => {
    server.shutdown();
  });

  it("check if user is already logged in", async () => {
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.isLoggedIn.isLoggedIn).toBe(true); // Adjust this line based on your actual state path
    });
  });
});
