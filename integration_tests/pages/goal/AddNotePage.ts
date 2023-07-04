import Page, { PageElement } from '../page'

export default class AddNotePage extends Page {
  constructor() {
    super('Add a note to this goal (optional)')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  setNote(note: string) {
    this.noteField().clear().type(note)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  noteField = (): PageElement => cy.get('#note')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
