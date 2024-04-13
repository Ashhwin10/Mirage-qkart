import { Login } from "./Pages/functions";

const login = new Login();

beforeEach(() => {
  cy.visit("http://localhost:3000/login");
  login.enterUsername();
  login.enterPassword();
  login.clickLogin();
});
describe("Products page", () => {

    
  it('add products to cart',()=>{
      cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
      cy.get('.css-zgtx0t').its('length').should('be.gt',0)
  })


  it('increase and decrease qty of product in cart',()=>{
      cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
      cy.get('.css-zgtx0t').its('length').should('be.gt',0)
      cy.get('.css-69i1ev > .MuiStack-root > :nth-child(3)').click()
      cy.get('[data-testid="item-qty"]').should('have.text', '2');
      cy.get('.css-69i1ev > .MuiStack-root > :nth-child(1)').click();
      cy.get('[data-testid="item-qty"]').should('have.text', '1');
  })


  it('Trying to add item already in cart',()=>{
      cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
      cy.get('.css-zgtx0t').its('length').should('be.gt',0)
      cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
      cy.get("#notistack-snackbar").should("contain", "Item already in cart. Use the cart sidebar to update quantity or remove item.");
  })


  it("Search functionality", () => {
    cy.get('.header > .MuiFormControl-root > .MuiInputBase-root').click().type('iphone')
    cy.get('.MuiGrid-grid-xs-true > .css-11lq3yg-MuiGrid-root > .MuiGrid-container').should('be.visible');
  });


  it("Adding products through search", () => {
    cy.get('.header > .MuiFormControl-root > .MuiInputBase-root').click().type('iphone')
    cy.get('.MuiGrid-grid-xs-true > .css-11lq3yg-MuiGrid-root > .MuiGrid-container').should('be.visible');
    cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get('.css-zgtx0t').its('length').should('be.gt',0)
})


it('Add products to the cart and click checkout',()=>{
    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get('.cart-footer > .MuiButtonBase-root').click()
    cy.url().should('eq', 'http://localhost:3000/checkout');
  });

});
 
