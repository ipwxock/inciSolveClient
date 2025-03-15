//login as Admin, success to see companies at /admin-panel/companis, success to visit /admin-panel/companies/new, success to create a new company
describe('Create a company', () => {
  it('should login as Admin, success to visit admin-panel/companies/new and create a company', () => {
    cy.loginAsAdmin()
    cy.visit('/admin-panel/companies')
    cy.get('a').contains('+ Añadir Aseguradora').click()
    cy.url().should('include', '/admin-panel/companies/new')
    cy.get('input[id=name]').type('Aseguradora NUEVA')
    cy.get('input[id=phone_number]').type('456873238')
    cy.get('textarea[id=description]').type('Una aseguradora que se preocupa por ti')
    cy.get('button[type=submit]').click()
    cy.get('div[role=alert]').should('be.visible').contains('Aseguradora creada correctamente')
    cy.logout()
  })
})

describe('Create a user', () => {
  it('should success to visit admin-panel/users/new and create a Manager user for the just created company, success to logout', () => {
    cy.loginAsAdmin()
    cy.visit('/admin-panel/users')
    cy.get('a').contains('+ Añadir Usuario').click()
    cy.url().should('include', '/admin-panel/users/new')
    cy.get('input[id=dni]').type('91827364G')
    cy.get('input[id=email]').type('juan.margin@example.com')
    cy.get('input[id=first_name]').type('Juan')
    cy.get('input[id=last_name]').type('Martin')
    cy.get('select[id=role]').select('Manager')
    cy.get('select[id=company_id]').select('Aseguradora NUEVA')
    cy.get('button[type=submit]').click()
    cy.get('div[role=alert]').should('be.visible').contains('Usuario creado correctamente')
    cy.logout()
  })
})

//login as Manager, success to see companies list at "/companies", success to update at /companies/:id/see
describe('Update a company as a manager', () => {
  it('login as Manager, success to see companies list at "/companies", success to update at /companies/:id/see', () => {
    cy.loginAsManagerWithCredentials('juan.margin@example.com', '91827364G')
    cy.visit('/companies')
    cy.get('a').contains('Gestionar mi Aseguradora').click()
    cy.url().should('include', '/companies/4/see') // 4 is the id of the company
    cy.get('input[id=name]').clear()
    cy.get('input[id=name]').type('Aseguradora NUEVA Editada')
    cy.get('button[type=submit]').click()
    cy.get('div[role=alert]').should('be.visible').contains('Aseguradora actualizada correctamente')
    cy.logout()
  })
})

describe('Create a new Insurance', () => {
  it('login as Manager, success to visit /insurances/new and create a new insurance', () => {
    cy.loginAsManagerWithCredentials('juan.margin@example.com', '91827364G')

    cy.visit('/customers')
    // Buscamos una fila que tenga exactamente "Liam" y "Anderson" en las columnas correspondientes
    cy.get('p').contains('No se encontraron clientes')
    cy.visit('/insurances')
    cy.get('a').contains('+ Nueva Póliza').click()
    cy.url().should('include', '/insurances/new')
    cy.get('select[id=customer_id]').select('Liam Anderson')
    cy.get('select[id=subject_type]').select('Viaje')
    cy.get('textarea[id=description]').type(
      'Un seguro de vida completo para disfrutar de tus vacaciones...',
    )
    cy.get('button[type=submit]').click()
    cy.get('div[role=alert]').should('be.visible').contains('Póliza creada correctamente')

    cy.visit('/customers')
    cy.get('td.customer-email').contains('liam.anderson@example.com').click()

    // Por último, fail al intentar entrar en admin-panel
    cy.visit('/admin-panel/')
    cy.url().should('include', '?error=403')
    cy.get('h1').contains('Acceso Denegado')
    cy.logout()
  })
})
