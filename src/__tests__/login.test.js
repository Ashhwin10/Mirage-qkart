import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../components/Login/Login";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import store from "../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MirageSetup } from "../mirage/mirage";

describe("Login page", () => {
  let getByTestId;
  let getByText;
  let server;

  beforeEach(() => {
    server = MirageSetup({environment : "test"});
    const component = render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Login />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
    getByTestId = component.getByTestId;
    getByText = component.getByText;
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Check if elements are rendered", () => {
    expect(getByTestId("usernameTextBox")).toBeInTheDocument();
    expect(getByTestId("passwordTextBox")).toBeInTheDocument();
    expect(getByTestId("loginButton")).toBeInTheDocument();
    expect(getByText("Don't have an account?")).toBeInTheDocument();
  });
  it("validation - username", () => {
    fireEvent.click(getByTestId("loginButton"));
    expect(
      screen.getByText("username is a required field")
    ).toBeInTheDocument();
  });

  it("validation - password", () => {
    fireEvent.change(
      screen.getByTestId("usernameTextBox").querySelector("input"),
      { target: { value: "testUser" } }
    );
    fireEvent.click(getByTestId("loginButton"));
    expect(
      screen.getByText("password is a required field")
    ).toBeInTheDocument();
  });

  it("Validation - Invalid username or password", async () => {
    fireEvent.change(screen.getByTestId("usernameTextBox").querySelector('input'), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByTestId("passwordTextBox").querySelector('input'), { target: { value: '1111111' } });
    fireEvent.click(getByTestId("loginButton"));

    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
    });
  });
  

  it(" check if Logged in successfully", async () => {
    server.create("user", { username: "testuser", password: "11111111" });

    fireEvent.change(screen.getByTestId("usernameTextBox").querySelector('input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId("passwordTextBox").querySelector('input'), { target: { value: '11111111' } });
    fireEvent.click(getByTestId("loginButton"));

    await waitFor(() => {
      const state = store.getState()
      expect(state.isLoggedIn.isLoggedIn).toBe(true)
    });
  });
});
