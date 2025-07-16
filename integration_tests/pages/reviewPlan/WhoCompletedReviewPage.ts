import Page, { PageElement } from '../page'
import SessionCompletedByValue from '../../../server/enums/sessionCompletedByValue'

/**
 * Cypress page class representing the "Who completed the review" page of the Review Plan journey
 */
export default class WhoCompletedReviewPage extends Page {
  constructor() {
    super('review-plan-who-completed-review')
  }

  selectWhoCompletedTheReview(value: SessionCompletedByValue): WhoCompletedReviewPage {
    this.radio(value).click()
    return this
  }

  enterReviewersFullName(value: string): WhoCompletedReviewPage {
    this.otherReviewersFullNameField().clear().type(value, { delay: 0 })
    return this
  }

  enterReviewersJobRole(value: string): WhoCompletedReviewPage {
    this.otherReviewersJobRoleField().clear().type(value, { delay: 0 })
    return this
  }

  setReviewDate(reviewDate: Date): WhoCompletedReviewPage {
    this.reviewDateField()
      .clear()
      .type(`${reviewDate.getDate()}/${reviewDate.getMonth() + 1}/${reviewDate.getFullYear()}`, { delay: 0 })
    return this
  }

  private radio = (value: SessionCompletedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private reviewDateField = (): PageElement => cy.get('#reviewDate')

  private otherReviewersFullNameField = (): PageElement => cy.get('[data-qa=completedByOtherFullName]')

  private otherReviewersJobRoleField = (): PageElement => cy.get('[data-qa=completedByOtherJobRole]')
}
