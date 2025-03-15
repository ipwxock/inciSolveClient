describe('Logout', () => {
  it('should logout successfully', () => {
    cy.loginAsCustomer()
    cy.visit('/')
    cy.get('#logout-btn').click()
    cy.url().should('include', '/login')
  })
})
