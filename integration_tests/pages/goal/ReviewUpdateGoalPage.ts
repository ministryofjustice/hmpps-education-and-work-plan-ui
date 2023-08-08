import Page, { PageElement } from '../page'

export default class UpdateGoalPage extends Page {
  constructor() {
    super('review-update-goal')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
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

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')
}
