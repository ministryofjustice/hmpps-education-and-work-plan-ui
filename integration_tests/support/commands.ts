import { RequestPatternBuilder } from '../mockApis/wiremock/requestPatternBuilder'
import { verify } from '../mockApis/wiremock'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: false }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('wiremockVerify', (requestPatternBuilder: RequestPatternBuilder) => {
  return cy.wrap(verify(1, requestPatternBuilder)).should('be.true')
})
