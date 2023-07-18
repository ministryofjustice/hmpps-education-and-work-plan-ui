import Page, { PageElement } from '../page'

export default class AddNotePage extends Page {
  constructor() {
    super('add-note')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasBackLinkForPrisoner(expected: string) {
    this.backLink().should('have.attr', 'href').and('contains', expected)
    return this
  }

  setNote(note: string) {
    this.noteField().clear().type(note)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  noteField = (): PageElement => cy.get('#note')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
