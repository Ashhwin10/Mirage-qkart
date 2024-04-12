/// ＜reference types="cypress" /＞
import { cy } from 'cypress';

describe('Qkart Login' , () =>{

    beforeEach(() =>{
        cy.visit('http://localhost:3000/')
    })
    it('Register' , () => {
        cy.get(".MuiStack-root > :nth-child(2)").click();
        cy.get("#username").type("Ashhwin");
        cy.get("#password").type("11111111");
        cy.get("#confirmPassword").type("11111111");
        cy.get('.MuiStack-root > .MuiButtonBase-root').click();
        cy.get('.link').should('contain', 'Register now')
        cy.get('#username').type('Ashhwin')
        cy.get('#password').type('11111111')
        cy.get('.MuiStack-root > .MuiButtonBase-root').click()
    })
    
})