import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Register from "../components/Register/Register";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import store from "../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { createMemoryHistory } from "history";



describe("check if register page rendering correctly", () => {
  let getByTestId;
  let getByText;

  beforeEach(() => {
    const component = render(
      <Router>
        <Provider store={store}>
          <SnackbarProvider>
            <Register />
          </SnackbarProvider>
        </Provider>
      </Router>
    );
    getByTestId = component.getByTestId;
    getByText = component.getByText;
  });

  it("if elements are rendered", () => {
    expect(getByTestId("usernameTextBox")).toBeInTheDocument();
    expect(getByTestId("passwordTextBox")).toBeInTheDocument();
    expect(getByTestId("confirmPasswordTextBox")).toBeInTheDocument();
    expect(getByTestId("registerNowButton")).toBeInTheDocument();
    expect(getByText("Already have an account?")).toBeInTheDocument();
  });

  it("User validation username is required", async () => {
    fireEvent.click(getByTestId("registerNowButton"));
    expect(screen.getByText("Username is a required field").toBeInTheDocument);
  });
 it("User validation password is required", async () => {
  fireEvent.change(screen.getByTestId("usernameTextBox").querySelector('input'), { target: { value: 'testUser' } });
  fireEvent.click(screen.getByTestId("registerNowButton"));
  expect(screen.getByText("Password is a required field")).toBeInTheDocument();
});

it("User validation password do not match", async () => {
  fireEvent.change(screen.getByTestId("usernameTextBox").querySelector('input'), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByTestId("passwordTextBox").querySelector('input'), { target: { value: 'hello123' } });
  fireEvent.click(screen.getByTestId("registerNowButton"));
  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
});

it("Should redirect on successfull register", () => {
  const history = createMemoryHistory();
  fireEvent.change(screen.getByTestId("usernameTextBox").querySelector('input'), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByTestId("passwordTextBox").querySelector('input'), { target: { value: 'hello123' } });
  fireEvent.change(screen.getByTestId("confirmPasswordTextBox").querySelector('input'), { target: { value: 'hello123' } });
  fireEvent.click(screen.getByTestId("registerNowButton"));
  expect(history.location.pathname).toBe('/')
})
});
