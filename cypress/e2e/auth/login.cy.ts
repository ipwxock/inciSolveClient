describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('input[id=email]').type('evelyn.green@example.com')
    cy.get('input[id=password]').type('password123')
    cy.get('button[type=submit]').click()
    cy.url().should('include', '/')
    cy.contains('h1', 'Hola, Evelyn Green')
  })

  it('should show error message if login fails', () => {
    cy.visit('/login')
    cy.get('input[id=email]').type('evelyn.green@example.com')
    cy.get('input[id=password]').type('wrongpassword')
    cy.get('button[type=submit]').click()
    cy.get('div[role=alert]').should('be.visible')
  })
})
