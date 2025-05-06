import Page, { PageElement } from '../page'

export default class UpdateGoalPage extends Page {
  constructor() {
    super('update-goal')
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

  setStepStatus(stepNumber: number, stepStatus: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE') {
    this.stepStatusField(stepNumber - 1, stepStatus).check()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherStep(): UpdateGoalPage {
    this.addAnotherStepButton().click()
    return this
  }

  clickRemoveButtonForSecondStep(): UpdateGoalPage {
    this.removeStepButton(1).click()
    return Page.verifyOnPage(UpdateGoalPage)
  }

  setTargetCompletionDateFromValuePreviouslySetOnGoal(): UpdateGoalPage {
    this.targetDateField().first().check()
    return this
  }

  setTargetCompletionDate(targetCompletionDate: string): UpdateGoalPage {
    this.targetDateField().last().check()
    this.manuallyEnteredTargetCompletionDateField().clear().type(targetCompletionDate)
    return this
  }

  hasTargetCompletionDateValue(expectedTargetCompletionDate: string): UpdateGoalPage {
    this.targetDateField()
      .filter(':checked')
      .then(selectedRadioElement => {
        if (selectedRadioElement.val() === 'another-date') {
          this.manuallyEnteredTargetCompletionDateField().should('have.value', expectedTargetCompletionDate)
        } else {
          cy.wrap(selectedRadioElement).should('have.value', expectedTargetCompletionDate)
        }
      })
    return this
  }

  titleField = (): PageElement => cy.get('#title')

  stepTitleField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-title-field]`)

  stepStatusField = (idx: number, stepStatus: string): PageElement =>
    cy.get(`[data-qa=step-${idx}-status-field-${stepStatus}]`)

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-submit-button]')

  addAnotherStepButton = (): PageElement => cy.get('[data-qa=goal-update-add-another-step-button]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  removeStepButton = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-remove-button]`)

  targetDateField = (): PageElement => cy.get('[name="targetCompletionDate"][type="radio"]')

  manuallyEnteredTargetCompletionDateField = (): PageElement => cy.get('#manuallyEnteredTargetCompletionDate')
}
