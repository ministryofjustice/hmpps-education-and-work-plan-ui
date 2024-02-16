import { RequestPatternBuilder } from '../wiremock/requestPatternBuilder'
import verify from '../wiremock/wiremockRequestVerifier'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: false }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('wiremockVerify', (requestPatternBuilder: RequestPatternBuilder) => {
  return cy.wrap(verify(requestPatternBuilder)).should('be.true')
})
