import Page, { PageElement } from '../page'
import ReviewNotePage from './ReviewNotePage'
import WhoCompletedReviewPage from './WhoCompletedReviewPage'

export default class ReviewPlanCheckYourAnswersPage extends Page {
  constructor() {
    super('review-plan-check-your-answers')
  }

  clickReviewCompletedByChangeLink(): WhoCompletedReviewPage {
    this.reviewCompletedByChangeLink().click()
    return Page.verifyOnPage(WhoCompletedReviewPage)
  }

  clickReviewNoteChangeLink(): ReviewNotePage {
    this.reviewNoteChangeLink().click()
    return Page.verifyOnPage(ReviewNotePage)
  }

  private reviewCompletedByChangeLink = (): PageElement => cy.get('[data-qa=review-completed-by-change-link]')

  private reviewNoteChangeLink = (): PageElement => cy.get('[data-qa=review-note-change-link]')
}
