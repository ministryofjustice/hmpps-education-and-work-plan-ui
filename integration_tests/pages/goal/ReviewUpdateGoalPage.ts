import Page, { PageElement } from '../page'

export default class ReviewUpdateGoalPage extends Page {
  constructor() {
    super('review-update-goal')
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  goBackToEditGoal() {
    this.backButton().click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  backButton = (): PageElement => cy.get('[data-qa=goal-update-review-back-button]')

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-review-submit-button]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')
}
