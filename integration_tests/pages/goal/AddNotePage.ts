import Page, { PageElement } from '../page'

export default class AddNotePage extends Page {
  constructor() {
    super('add-note')
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
}
