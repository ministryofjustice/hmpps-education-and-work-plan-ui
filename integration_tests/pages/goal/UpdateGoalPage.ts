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
    this.setStepTitle(1, stepTitle)
    return this
  }

  setStepTitle(stepNumber: number, stepTitle: string) {
    this.stepTitleField(stepNumber - 1)
      .clear()
      .type(stepTitle)
    return this
  }

  setStepStatus(stepNumber: number, stepStatus: 'Not started' | 'Started' | 'Completed') {
    this.stepStatusField(stepNumber - 1).select(stepStatus)
    return this
  }

  setStepTargetDateRange(
    stepNumber: number,
    stepTargetDateRange: '0 to 3 months' | '3 to 6 months' | '6 to 12 months' | 'More than 12 months',
  ) {
    this.stepTargetDateRangeField(stepNumber - 1)
      .contains('label', stepTargetDateRange)
      .siblings('input[type=radio]')
      .check()
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

  stepStatusField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-status-field]`)

  stepTargetDateRangeField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-target-date-range-field]`)

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-submit-button]')

  addAnotherStepButton = (): PageElement => cy.get('[data-qa=goal-update-add-another-step-button]')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')
}
