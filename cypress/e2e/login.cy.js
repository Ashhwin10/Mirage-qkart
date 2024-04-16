/// ＜reference types="cypress" /＞
import { Login } from "./Pages/functions";

const login = new Login();

beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

describe("Qkart Login", () => {

  it('Login successfull',()=>{
    login.enterUsername();
    login.enterPassword();
    login.clickLogin();
  })


  it(" Invalid login ", () => {
    login.enterUsername();
    cy.get("#password").type("1111111");
    login.clickLogin();
    cy.get("#notistack-snackbar").should(
      "contain",
      "Invalid username or password"
    );
  });
 
});
