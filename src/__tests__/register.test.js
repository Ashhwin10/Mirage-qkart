import { render } from "@testing-library/react";
import Register from "../components/Register/Register";

describe("check if register page redering correctly", () => {
  it("if elements are rendered", () => {
    const { getByTestId } = render(<Register />);
    const input = getByTestId("usernameTextBox");
    expect(input).toBeTruthy();
  });
});
