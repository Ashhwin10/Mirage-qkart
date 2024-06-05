import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Register from "./Register";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MirageSetup } from "../../mirage/mirage";

describe("Register page", () => {
  let server;
  const setup = () =>
    render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Register />
          </SnackbarProvider>
        </Provider>
      </Router>
    );

  beforeEach(() => {
    server = MirageSetup({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("should render all elements", () => {
    setup();
    expect(screen.getByPlaceholderText(/Enter Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register Now/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  it("should validate that username is required", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Username is a required field")
      ).toBeInTheDocument();
    });
  });

  it("should validate that password is required", async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Password is a required field")
      ).toBeInTheDocument();
    });
  });

  it("should validate that passwords do not match", async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "hello123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter confirm password/i), {
      target: { value: "differentPassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("should show success message on successful registration", async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "hello123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter confirm password/i), {
      target: { value: "hello123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(screen.getByText("Registered Successfully")).toBeInTheDocument();
    });
  });

  it("should call registerUser action on registration", async () => {
    setup();
    const registerUserSpy = jest.spyOn(
      require("../../redux/register/register"),
      "registerUser"
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "hello123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter confirm password/i), {
      target: { value: "hello123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(registerUserSpy).toHaveBeenCalledWith("testUser", "hello123");
    });
    registerUserSpy.mockRestore();
  });

  it("should call validateInput function", async () => {
    setup();
    const validateInputSpy = jest.spyOn(
      require("./RegisterValidation"),
      "validateInput"
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "hello123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter confirm password/i), {
      target: { value: "hello123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register Now/i }));
    await waitFor(() => {
      expect(validateInputSpy).toHaveBeenCalled();
    });
    validateInputSpy.mockRestore();
  });
});
