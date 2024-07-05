import Page, { PageElement } from '../page'

export default class UnarchiveGoalPage extends Page {
  constructor() {
    super('unarchive-goal')
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  clickYes() {
    this.yesButton().click()
  }

  clickNo() {
    this.noButton().click()
  }

  private goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  private yesButton = (): PageElement => cy.get('[data-qa=goal-unarchive-submit-button]')

  private noButton = (): PageElement => cy.get('[data-qa=goal-unarchive-back-button]')
}
