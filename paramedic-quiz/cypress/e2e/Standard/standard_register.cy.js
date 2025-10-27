describe('Registration form', () => {
  it('registers a new user successfully', () => {
    cy.visit('http://localhost:5173/register')

    const uniqueEmail = `user${Date.now()}@example.com`
    cy.get('input').filter('[type=text], [type=email], :not([type])').then($inputs => {
      cy.wrap($inputs.eq(0)).clear().type('New Tester')
      cy.wrap($inputs.eq(1)).clear().type(uniqueEmail)
    })

    cy.get('input[type=password]').clear().type('password123')
    cy.get('button[type=submit]').click()

    
        cy.url().should('include', '/')
        cy.contains(/Code Green Quiz|Hello|Dashboard/i).should('be.visible')
      
    })
  })

