// cypress/e2e/advanced_rate_limit_like.cy.js
describe('Repeated failed login attempts', () => {
  it('handles multiple bad logins without crashing the UI', () => {
    cy.visit('http://localhost:5173/login')

    // Try 3 quick failed attempts and make sure the UI still responds.
    const tryBadLogin = (n) => {
      cy.log(`Attempt ${n}`)
      cy.get('input[type=email]').clear().type(`nosuchuser${n}@example.com`)
      cy.get('input[type=password]').clear().type('wrongpassword')
      cy.get('button[type=submit]').click()

      // After each attempt, there should still be an error message rendered
      // and the form should still exist for another try.
      cy.get('.login-error')
        .should('be.visible')
        .and($el => {
          const text = $el.text()
          expect(text.length).to.be.greaterThan(0)
        })
      cy.url().should('include', '/login')
    }

    tryBadLogin(1)
    tryBadLogin(2)
    tryBadLogin(3)

    // App should not have thrown or navigated away. If it did, something's wrong.
    cy.contains(/Login/i).should('be.visible')
  })
})
