// cypress/e2e/standard_home.cy.js
describe('Home page basics', () => {
  it('redirects unauthenticated users to the login page', () => {
    cy.clearLocalStorage()

      cy.visit('http://localhost:5173/') 

    // App should push us to /login because we're not logged in
    cy.url().should('include', '/login')

    // And we should see the login form content
    cy.contains(/Login/i).should('be.visible')
    cy.get('input[type=email]').should('be.visible')
    cy.get('input[type=password]').should('be.visible')
  })
})
