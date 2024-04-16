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
        cy.get('[data-cy="checkout"]').click()
        cy.get('#add-new-btn').click()
        cy.get('[data-cy="address-textbox"]').click().type('No 10, greencity ,Chennai-651010')
        cy.get('[data-cy="add-new-btn"]').click()
        cy.get('[  data-cy="select-address"]').click()
        cy.get('[ data-cy="place-order"]').click()
        cy.get('[data-cy="Continue Shopping"]').click()
        cy.url().should('eq', 'http://localhost:3000/');
    })
})

