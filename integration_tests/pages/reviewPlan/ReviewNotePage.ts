import Page, { PageElement } from '../page'

export default class ReviewNotePage extends Page {
  constructor() {
    super('review-plan-review-note')
  }

  setReviewNote = (notes: string): ReviewNotePage => {
    this.reviewNotesField().clear().type(notes)
    return this
  }

  clearReviewNote = (): ReviewNotePage => {
    this.reviewNotesField().clear()
    return this
  }

  private reviewNotesField = (): PageElement => cy.get('#notes')
}
