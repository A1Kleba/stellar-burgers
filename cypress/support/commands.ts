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

Cypress.Commands.add('addIngredientByName', (name: string) => {
    cy.contains(name).parent('li').find('button').first().click();
});

Cypress.Commands.add('setTokens', () => {
    cy.setCookie('accessToken', 'Bearer mock-token');
    cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh');
    });
});

Cypress.Commands.add('clearTokens', () => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
});

declare namespace Cypress {
    interface Chainable {
        addIngredientByName(name: string): Chainable<void>;
        setTokens(): Chainable<void>;
        clearTokens(): Chainable<void>;
    }
}