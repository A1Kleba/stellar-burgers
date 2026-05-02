/// <reference types="cypress" />

describe('Интеграционный тест конструктора бургера', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

        localStorage.setItem('refreshToken', 'mock-refresh-token');
        cy.setCookie('accessToken', 'mock-access-token');

        cy.visit('/');
        cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
        localStorage.removeItem('refreshToken');
        cy.clearCookies();
    });

    it('Полный сценарий работы с конструктором бургера', () => {
        cy.get('[data-testid="ingredient"]').should('have.length.greaterThan', 0);

        cy.get('[data-testid="ingredient-bun"]').first()
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { clientX: 200, clientY: 300 })
            .trigger('mouseup', { force: true });
        cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Булка с кунжутом');

        cy.get('[data-testid="ingredient-main"]').first()
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { clientX: 200, clientY: 350 })
            .trigger('mouseup', { force: true });
        cy.get('[data-testid="constructor-main"]').should('contain', 'Говядина');

        cy.get('[data-testid="ingredient-sauce"]').first()
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { clientX: 200, clientY: 400 })
            .trigger('mouseup', { force: true });
        cy.get('[data-testid="constructor-sauce"]').should('contain', 'Соус BBQ');

        cy.get('[data-testid="ingredient-main"]').contains('Говядина').click();
        cy.get('[data-testid="modal-ingredient"]').should('be.visible');
        cy.get('[data-testid="modal-title"]').should('contain', 'Детали ингредиента');
        cy.get('[data-testid="ingredient-name"]').should('contain', 'Говядина');


        cy.get('[data-testid="close-modal"]').click();
        cy.get('[data-testid="modal-ingredient"]').should('not.be.visible');

        cy.get('[data-testid="ingredient-sauce"]').contains('Соус BBQ').click();
        cy.get('[data-testid="overlay"]').click({ force: true });
        cy.get('[data-testid="modal-ingredient"]').should('not.be.visible');


        cy.get('[data-testid="order-button"]').click();
        cy.wait('@createOrder');
        cy.get('[data-testid="order-modal"]').should('be.visible');
        cy.get('[data-testid="order-number"]').should('contain', '12345');


        cy.get('[data-testid="close-order-modal"]').click();
        cy.get('[data-testid="order-modal"]').should('not.be.visible');

        cy.get('[data-testid="constructor"]').should('be.empty');
    });
});
