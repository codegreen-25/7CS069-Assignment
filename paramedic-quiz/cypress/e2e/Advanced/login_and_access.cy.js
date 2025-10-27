describe('Authenticated access to protected content', () => {
  it('lets an authenticated user visit a protected page without redirect', () => {
    // 1. Log in via UI to get a real token
    cy.visit('http://localhost:5173/login') 
    cy.get('input[type=email]').type('test@example.com')
    cy.get('input[type=password]').type('password123')
    cy.get('button[type=submit]').click()

    // After login we should land somewhere authenticated (/, dashboard, etc.)
    cy.url().should('not.include', '/login')

    // 2. Go to protected profile page
    cy.visit('http://localhost:5173/account/profile')

    // Expect some logged-in UI
    cy.contains('Profile').should('be.visible')
  })
})
