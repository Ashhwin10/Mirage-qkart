import { Login } from "./Pages/functions";

const login = new Login();

describe('Thanks page',()=>{
    it('Thanks page',()=>{
        cy.visit("http://localhost:3000/login");
        login.enterUsername();
        login.enterPassword();
        login.clickLogin();
        cy.wait(5000)
        cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click()
        cy.get('.cart-footer > .MuiButtonBase-root').click()
        cy.get('#add-new-btn').click()
        cy.get('.MuiInputBase-root').click().type('No 10, greencity ,Chennai-651010')
        cy.get('.MuiStack-root > .MuiButton-contained').click()
        cy.get('.address-item').click()
        cy.get('.shipping-container > :nth-child(10)').click()
        cy.get('#continue-btn').click()
        cy.url().should('eq', 'http://localhost:3000/');
    })
})

