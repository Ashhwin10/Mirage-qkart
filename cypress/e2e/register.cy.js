/// ＜reference types="cypress" /＞
import { Register } from "./Pages/functions";

const register = new Register();

beforeEach(() => {
  cy.visit("http://localhost:3000/register");
});

describe("Registered successfully", () => {
  it("Regiserter page", () => {
    register.enterUsername();
    register.enterPassword();
    register.enterConfirmPassword();
    register.clickRegister();
    cy.get("#notistack-snackbar").should("contain", "Registered Successfully");
  });
});

describe(" password mismatch", () => {
  it("Register page password mismatch", () => {
    register.enterUsername();
    register.enterPassword();
    cy.get("#confirmPassword").type("1111111");
    register.clickRegister();
    cy.get("#notistack-snackbar").should("contain", "Passwords do not match");
    
  });
});

describe(" username already existing", () => {
  it("Regiserter page", () => {
    register.enterUsername();
    register.enterPassword();
    register.enterConfirmPassword();
    register.clickRegister();
    cy.wait(500)
    cy.get('[data-cy="Explore-header"]').click()
    cy.get('[data-cy="Register-header"]').click()
    register.enterUsername();
    register.enterPassword();
    register.enterConfirmPassword();
    register.clickRegister();
    cy.get("#notistack-snackbar").should("contain", "Username not available");
  });
});
