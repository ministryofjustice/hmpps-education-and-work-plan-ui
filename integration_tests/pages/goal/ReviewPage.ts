import Page, { PageElement } from '../page'

export default class ReviewPage extends Page {
  constructor() {
    super('review')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasBackLinkForPrisoner(expected: string) {
    this.backLink().should('have.attr', 'href').and('contains', expected)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
