import { Login } from "./Pages/functions";

const login = new Login();


describe('Checkout page',()=>{
    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        login.enterUsername();
        login.enterPassword();
        login.clickLogin();
        cy.wait(5000)
        cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
        cy.get('.cart-footer > .MuiButtonBase-root').click()
      });

it('Add new address',()=>{
    cy.get('#add-new-btn').click()
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.address-item').its('length').should('be.gt',0)
})


it('Delete address',()=>{
    cy.get('#add-new-btn').click()
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.address-item > .MuiButtonBase-root').click()
    cy.get('.address-item').should('have.length', 0);

})


it('Add multiple addresses',()=> {
    cy.get('#add-new-btn').click()
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.address-item').its('length').should('be.gt',0)
    cy.get('.MuiInputBase-root').clear();
    cy.get('.MuiInputBase-root').click().type('No 11, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.MuiInputBase-root').clear();
    cy.get('.MuiInputBase-root').click().type('No 12, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.MuiInputBase-root').clear();
    cy.get('.address-item').its('length').should('be.gt',2)
})

it('Click checkout without adding address',()=>{
    cy.get('.shipping-container > .MuiButton-sizeMedium').click()
    cy.get("#notistack-snackbar").should("contain", "Please add a new address before proceeding.");
})

it('Click checkout without selecting address',()=>{
    cy.get('#add-new-btn').click();
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.MuiInputBase-root').clear();
    cy.get('.MuiInputBase-root').click().type('No 20, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.MuiInputBase-root').clear();
    cy.get('.shipping-container > :nth-child(10)').click()
    cy.get("#notistack-snackbar").should("contain", "Please select one shipping address to proceed.");
})
it('Checking out',()=>{
    cy.get('#add-new-btn').click()
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.address-item').click()
    cy.get('.shipping-container > :nth-child(10)').click()
    cy.url().should('eq', 'http://localhost:3000/thanks');
    cy.get("#notistack-snackbar").should("contain", "Order placed successfully");
})

})
it('Checking out with insufficient balance',()=>{
    cy.visit("http://localhost:3000/login");
    login.enterUsername();
    login.enterPassword();
    login.clickLogin();
    cy.wait(2000)
    cy.get(':nth-child(7) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get(':nth-child(8) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get(':nth-child(6) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get(':nth-child(10) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
    cy.get('.cart-footer > .MuiButtonBase-root').click()
    cy.get('#add-new-btn').click()
    cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
    cy.get('.MuiStack-root > .MuiButton-contained').click()
    cy.get('.address-item').click()
    cy.get('.shipping-container > :nth-child(10)').click()
    cy.get("#notistack-snackbar").should("contain", "You do not have enough balance in your wallet for this purchase");
})