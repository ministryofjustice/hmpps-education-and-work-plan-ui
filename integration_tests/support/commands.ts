Cypress.Commands.add('signIn', (options = { failOnStatusCode: false }) => {
  cy.task('stubPrisonerList')
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
