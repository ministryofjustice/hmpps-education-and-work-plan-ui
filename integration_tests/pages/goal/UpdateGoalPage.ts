import Page, { PageElement } from '../page'

export default class UpdateGoalPage extends Page {
  constructor() {
    super('update-goal')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  setGoalTitle(title: string): this {
    this.titleField().clear().type(title)
    return this
  }

  clearGoalTitle() {
    this.titleField().clear()
    return this
  }

  setFirstStepTitle(stepTitle: string) {
    this.stepTitleField().first().clear().type(stepTitle)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  titleField = (): PageElement => cy.get('#title')

  stepTitleField = (): PageElement => cy.get('[data-qa=step-title-field]')

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-submit-button]')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')
}
