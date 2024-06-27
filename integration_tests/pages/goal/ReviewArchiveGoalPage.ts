import Page, { PageElement } from '../page'

export default class ReviewArchiveGoalPage extends Page {
  constructor() {
    super('review-archive-goal')
  }

  clickYes() {
    this.yesButton().click()
  }

  clickNo() {
    this.noButton().click()
  }

  private yesButton = (): PageElement => cy.get('[data-qa=goal-archive-review-submit-button]')

  private noButton = (): PageElement => cy.get('[data-qa=goal-archive-review-back-button]')
}
