describe('Registration form', () => {
  it('Shows error when email is already taken', () => {
    cy.visit('http://localhost:5173/register')

    cy.get('input').filter('[type=text], [type=email], :not([type])').then($inputs => {
      cy.wrap($inputs.eq(0)).clear().type('New Tester')
      cy.wrap($inputs.eq(1)).clear().type('test@example.com') //email that's already taken
    })

    cy.get('input[type=password]').clear().type('password123')
    cy.get('button[type=submit]').click()


      
    cy.get('.register-error')
        .should('be.visible')
        .and('contain.text', 'email')
      
    
  })
})
