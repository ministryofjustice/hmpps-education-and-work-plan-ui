import Page, { PageElement } from '../page'

export default class UnarchiveGoalPage extends Page {
  constructor() {
    super('unarchive-goal')
  }

  clickYes() {
    this.yesButton().click()
  }

  clickNo() {
    this.noButton().click()
  }

  private yesButton = (): PageElement => cy.get('[data-qa=goal-unarchive-submit-button]')

  private noButton = (): PageElement => cy.get('[data-qa=goal-unarchive-back-button]')
}
