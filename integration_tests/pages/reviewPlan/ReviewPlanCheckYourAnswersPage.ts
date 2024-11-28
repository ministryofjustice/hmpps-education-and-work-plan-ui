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

  reviewWasCompletedByMyself(): ReviewPlanCheckYourAnswersPage {
    this.reviewCompletedByMyself().should('be.visible')
    this.reviewCompletedBySomebodyElse().should('not.exist')
    this.reviewCompletedByJobRole().should('not.exist')
    return this
  }

  reviewWasCompletedBySomebodyElse(expected: string): ReviewPlanCheckYourAnswersPage {
    this.reviewCompletedByMyself().should('not.exist')
    this.reviewCompletedBySomebodyElse().should(element => expect(element.text().trim()).to.eq(expected.trim()))
    this.reviewCompletedByJobRole().should('exist')
    return this
  }

  reviewWasCompletedBySomebodyElseWithJobRole(expected: string): ReviewPlanCheckYourAnswersPage {
    this.reviewCompletedByMyself().should('not.exist')
    this.reviewCompletedBySomebodyElse().should('exist')
    this.reviewCompletedByJobRole().should(element => expect(element.text().trim()).to.eq(expected.trim()))
    return this
  }

  hasNotes(expected: string): ReviewPlanCheckYourAnswersPage {
    this.reviewNote().should(element => expect(element.text().trim()).to.eq(expected.trim()))
    return this
  }

  private reviewCompletedByChangeLink = (): PageElement => cy.get('[data-qa=review-completed-by-change-link]')

  private reviewNoteChangeLink = (): PageElement => cy.get('[data-qa=review-note-change-link]')

  private reviewCompletedByMyself = (): PageElement => cy.get('[data-qa=review-completed-by-MYSELF]')

  private reviewCompletedBySomebodyElse = (): PageElement => cy.get('[data-qa=review-completed-by-SOMEBODY_ELSE]')

  private reviewCompletedByJobRole = (): PageElement => cy.get('[data-qa=job-role]')

  private reviewNote = (): PageElement => cy.get('[data-qa=review-note]')
}
