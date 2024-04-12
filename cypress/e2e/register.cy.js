/// ＜reference types="cypress" /＞
import { cy } from 'cypress';


beforeEach(() => {
  cy.visit("http://localhost:3000/");
});

describe("Registered successfully", () => {
  it("Regiserter page", () => {
    cy.get(".MuiStack-root > :nth-child(2)").click();
    cy.get("#username").type("Ashhwin");
    cy.get("#password").type("11111111");
    cy.get("#confirmPassword").type("11111111");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.get("#notistack-snackbar").should("contain", "Registered Successfully");
  });
});

describe(" password mismatch", () => {
  it("Register page password mismatch", () => {
    cy.get(".MuiStack-root > :nth-child(2)").click();
    cy.get("#username").type("Ashhwin");
    cy.get("#password").type("11111111");
    cy.get("#confirmPassword").type("1111111");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.get("#notistack-snackbar").should("contain", "Passwords do not match");
  });
});

describe(" username not available", () => {
  it("Regiserter page", () => {
    cy.get(".MuiStack-root > :nth-child(2)").click();
    cy.get("#username").type("Ashhwin");
    cy.get("#password").type("11111111");
    cy.get("#confirmPassword").type("11111111");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.get(".header > .MuiButtonBase-root").click();
    cy.get(".header > .MuiButtonBase-root").click();
    cy.get(".MuiStack-root > :nth-child(2)").click();
    cy.get("#username").type("Ashhwin");
    cy.get("#password").type("11111111");
    cy.get("#confirmPassword").type("11111111");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.get("#notistack-snackbar").should("contain", "Username not available");
  });
});
