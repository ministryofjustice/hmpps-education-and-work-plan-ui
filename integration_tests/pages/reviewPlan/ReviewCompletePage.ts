import Page, { PageElement } from '../page'

export default class ReviewCompletePage extends Page {
  constructor() {
    super('review-complete')
  }

  hasNextReviewDueMessage(expected: string): ReviewCompletePage {
    this.nextReviewDueMessage().should(element => expect(element.text().trim()).to.eq(expected.trim()))
    this.noReviewsDueMessage().should('not.exist')
    return this
  }

  hasNoReviewsDueMessageDisplayed(): ReviewCompletePage {
    this.nextReviewDueMessage().should('not.exist')
    this.noReviewsDueMessage().should('exist')
    return this
  }

  private nextReviewDueMessage = (): PageElement => cy.get('[data-qa=next-review-due]')

  private noReviewsDueMessage = (): PageElement => cy.get('[data-qa=no-reviews-due]')
}
