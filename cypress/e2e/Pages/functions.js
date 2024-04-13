export class Register {
  enterUsername() {
    cy.get("#username").type("Ashhwin");
  }
  enterPassword() {
    cy.get("#password").type("11111111");
  }
  enterConfirmPassword() {
    cy.get("#confirmPassword").type("11111111");
  }
  clickRegister() {
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
  }
}
export class Login {
  enterUsername() {
    cy.get("#username").type("testuser");
  }
  enterPassword() {
    cy.get("#password").type("11111111");
  }
  clickLogin() {
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
  }
}
