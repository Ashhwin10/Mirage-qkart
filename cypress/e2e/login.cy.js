/// ＜reference types="cypress" /＞
import { Login } from "./Pages/functions";

const login = new Login();

beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

describe("Qkart Login", () => {

  it('Login successfull',()=>{
    cy.get("#username").type("testuser");
    cy.get("#password").type("11111111");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
  })


  it(" Invalid login ", () => {
    login.enterUsername();
    login.enterPassword();
    login.clickLogin();
    cy.get("#notistack-snackbar").should(
      "contain",
      "Invalid username or password"
    );
  });
 
});
