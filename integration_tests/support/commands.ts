import { WiremockRequestMatcher } from '../mockApis/wiremock'
import { verifyWiremockRequestSent } from '../mockApis/wiremockRequestVerifier'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: false }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('verifyWiremock', (options: { requestMatcher: WiremockRequestMatcher; times?: number }) => {
  return cy
    .wrap(verifyWiremockRequestSent({ requestMatcher: options.requestMatcher, times: options.times || 1 }))
    .should('be.true')
})
