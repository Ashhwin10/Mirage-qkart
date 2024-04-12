
/// ＜reference types="cypress" /＞
import { cy } from 'cypress';

describe('Qkart Login' , () =>{

    beforeEach(() =>{
        cy.visit('http://localhost:3000/')
    })
    it(' Invalid login ' , () => {
        cy.get('.MuiStack-root > :nth-child(1)').click()
        cy.get('#username').type('Ashhwin')
        cy.get('#password').type('11111111')
        cy.get('.MuiStack-root > .MuiButtonBase-root').click()
        cy.get("#notistack-snackbar").should("contain", "Invalid username or password");

    })
})