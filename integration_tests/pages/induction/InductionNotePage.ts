import Page, { PageElement } from '../page'

export default class InductionNotePage extends Page {
  constructor() {
    super('induction-note')
  }

  setInductionNote = (notes: string): InductionNotePage => {
    this.inductionNotesField().clear().type(notes)
    return this
  }

  clearInductionNote = (): InductionNotePage => {
    this.inductionNotesField().clear()
    return this
  }

  private inductionNotesField = (): PageElement => cy.get('[data-qa=notes]')
}
