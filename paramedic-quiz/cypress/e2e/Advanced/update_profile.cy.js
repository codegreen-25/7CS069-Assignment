describe('Profile update (authenticated action)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('lets an authenticated user change their display name', () => {
    // 1. Log in via UI to get a real token
    cy.visit('http://localhost:5173/login') 
    cy.get('input[type=email]').type('test@example.com')
    cy.get('input[type=password]').type('password123')
    cy.get('button[type=submit]').click()

    // 2. After login we should land somewhere authenticated (/, dashboard, etc.)
    cy.url().should('not.include', '/login')

    // 3. Go to profile page
    cy.visit('http://localhost:5173/account/profile')

    // 4. Click "Edit" (button with aria-label="Edit display name")
    cy.get('button[aria-label="Edit display name"]').click()

    // 5. Change the display name
    const newName = `Tester ${Date.now()}`
    cy.get('input.input[required]')
      .clear()
      .type(newName)

    // 6. Click "Save"
    cy.contains('button.btn.profile-btn', 'Save').click()

    // 7. Confirm the new name is now visible somewhere on the page
    cy.contains(newName).should('be.visible')

    // 8. Confirm we stayed on profile (not redirected back to login)
    cy.url().should('include', '/profile')
}) })
