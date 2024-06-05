import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MirageSetup } from "../../mirage/mirage";

describe("Login page", () => {
  const setup = () =>
    render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Login />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
  let server;
  beforeEach(() => {
    server = MirageSetup({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Check if elements are rendered", () => {
    setup();
    expect(screen.getByPlaceholderText(/Enter Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /LOGIN TO QKART/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
  it("validation - username", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /LOGIN TO QKART/i }));
    expect(
      screen.getByText("username is a required field")
    ).toBeInTheDocument();
  });

  it("validation - password", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN TO QKART/i }));
    expect(
      screen.getByText("password is a required field")
    ).toBeInTheDocument();
  });

  it("Validation - Invalid username or password", async () => {
    setup();
    fireEvent.change(
      screen.getByPlaceholderText(/Enter Username/i),

      { target: { value: "testuser" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "1111111" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN TO QKART/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid username or password")
      ).toBeInTheDocument();
    });
  });

  it(" check if Logged in successfully", async () => {
    setup();
    server.create("user", { username: "testuser", password: "11111111" });

    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "11111111" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN TO QKART/i }));

    await waitFor(() => {
      const state = store.getState();
      expect(state.isLoggedIn.isLoggedIn).toBe(true);
    });
  });

  it("check if fetchLoginData and loginSuccess called correctly", async () => {
    setup();
    const fetchLoginDataSpy = jest.spyOn(
      require("../../redux/login/loginSlice"),
      "fetchLoginData"
    );
    const loginSuccessSpy = jest.spyOn(
      require("../../redux/login/loginSlice"),
      "loginSuccess"
    );

    server.create("user", { username: "testuser", password: "11111111" });

    fireEvent.change(
      screen.getByPlaceholderText(/Enter Username/i),

      { target: { value: "testuser" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "11111111" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN TO QKART/i }));

    await waitFor(() => {
      expect(loginSuccessSpy).toHaveBeenCalled();
      expect(fetchLoginDataSpy).toHaveBeenCalled();
    });

    fetchLoginDataSpy.mockRestore();
    loginSuccessSpy.mockRestore();
  });
});
