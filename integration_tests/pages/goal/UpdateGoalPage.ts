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
    this.stepTitleField(0).clear().type(stepTitle)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherStep(): UpdateGoalPage {
    this.addAnotherStepButton().click()
    return this
  }

  titleField = (): PageElement => cy.get('#title')

  stepTitleField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-title-field]`)

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-submit-button]')

  addAnotherStepButton = (): PageElement => cy.get('[data-qa=goal-update-add-another-step-button]')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')
}
