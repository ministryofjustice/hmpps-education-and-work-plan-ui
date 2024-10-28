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

  enterReviewersFullName(value: string): WhoCompletedReviewPage {
    this.otherReviewersFullNameField().clear().type(value)
    return this
  }

  enterReviewersJobRole(value: string): WhoCompletedReviewPage {
    this.otherReviewersJobRoleField().clear().type(value)
    return this
  }

  setReviewDate(day: string, month: string, year: string): WhoCompletedReviewPage {
    this.reviewDateDayField().clear().type(day)
    this.reviewDateMonthField().clear().type(month)
    this.reviewDateYearField().clear().type(year)
    return this
  }

  private radio = (value: ReviewPlanCompletedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private reviewDateDayField = (): PageElement => cy.get('[data-qa=review-date-day]')

  private reviewDateMonthField = (): PageElement => cy.get('[data-qa=review-date-month]')

  private reviewDateYearField = (): PageElement => cy.get('[data-qa=review-date-year]')

  private otherReviewersFullNameField = (): PageElement => cy.get('[data-qa=completedByOtherFullName]')

  private otherReviewersJobRoleField = (): PageElement => cy.get('[data-qa=completedByOtherJobRole]')
}
