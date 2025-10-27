// cypress/e2e/login.cy.js
describe('Login flow', () => {

  beforeEach(() => {
    // Always start from a clean state
    cy.clearLocalStorage()
  })

  it('logs in successfully and redirects to home', () => {
    cy.visit('http://localhost:5173/login') 
    cy.get('input[type=email]').type('test@example.com')
    cy.get('input[type=password]').type('password123')
    cy.get('button[type=submit]').click()

    // Successful login
    cy.url().should('include', '/')
    cy.contains('Hello') 
  })

  it('shows error on invalid credentials', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('input[type=email]').type('doesnotexist@example.com')
    cy.get('input[type=password]').type('wrongpassword')
    cy.get('button[type=submit]').click()

    // Expect the visible error feedback
    cy.get('.login-error')
      .should('be.visible')
      .and($el => {
        const text = $el.text()
        expect(text.length).to.be.greaterThan(0)
      })

    cy.url().should('include', '/login')
  })
})
