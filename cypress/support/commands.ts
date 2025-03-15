/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Extiende la interfaz global de Cypress
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsEmployee(): Chainable<void>
      loginAsCustomer(): Chainable<void>
      loginAsManager(): Chainable<void>
      loginAsManagerWithCredentials(email: string, password: string): Chainable<void>
    }
  }
}
// Agrega el comando personalizado
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/')
  cy.contains('h1', 'Hola,')
})

Cypress.Commands.add('logout', () => {
  cy.get('#logout-btn').click()
  cy.url().should('include', '/login')
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('lance.noble@example.com', 'password123')
})

Cypress.Commands.add('loginAsEmployee', () => {
  cy.login('luna.nelson@example.com', 'password123')
})

Cypress.Commands.add('loginAsCustomer', () => {
  cy.login('alice.brown@example.com', 'password123')
})

Cypress.Commands.add('loginAsManager', () => {
  cy.login('evelyn.green@example.com', 'password123')
})

Cypress.Commands.add('loginAsManagerWithCredentials', (email, password) => {
  cy.login(email, password)
})

export {}
