import Page, { PageElement } from '../page'
import ReviewPlanCompletedByValue from '../../../server/enums/reviewPlanCompletedByValue'

/**
 * Cypress page class representing the "Who completed the review" page of the Review Plan journey
 */
export default class WhoCompletedReviewPage extends Page {
  constructor() {
    super('review-plan-who-completed-review')
  }

  selectWhoCompletedTheReview(value: ReviewPlanCompletedByValue): WhoCompletedReviewPage {
    this.radio(value).click()
    return this
  }

  enterReviewersName(value: string): WhoCompletedReviewPage {
    this.otherReviewersNameField().clear().type(value)
    return this
  }

  setReviewDate(day: string, month: string, year: string): WhoCompletedReviewPage {
    this.reviewDateDayField().clear().type(day)
    this.reviewDateMonthField().clear().type(month)
    this.reviewDateYearField().clear().type(year)
    return this
  }

  private radio = (value: ReviewPlanCompletedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private reviewDateDayField = (): PageElement => cy.get('#review-date-day')

  private reviewDateMonthField = (): PageElement => cy.get('#review-date-month')

  private reviewDateYearField = (): PageElement => cy.get('#review-date-year')

  private otherReviewersNameField = (): PageElement => cy.get('#completedByOther')
}
