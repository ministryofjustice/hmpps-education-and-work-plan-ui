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

  setTargetCompletionDate(day: string, month: string, year: string): UpdateGoalPage {
    this.targetDateField().last().check()
    this.targetDateFieldDayField().clear().type(day)
    this.targetDateFieldMonthField().clear().type(month)
    this.targetDateFieldYearField().clear().type(year)
    return this
  }

  hasTargetCompletionDateValue(expectedDay: string, expectedMonth: string, expectedYear: string): UpdateGoalPage {
    this.targetDateField()
      .filter(':checked')
      .then(selectedRadioElement => {
        if (selectedRadioElement.val() === 'another-date') {
          this.targetDateFieldDayField().should('have.value', expectedDay)
          this.targetDateFieldMonthField().should('have.value', expectedMonth)
          this.targetDateFieldYearField().should('have.value', expectedYear)
        } else {
          cy.wrap(selectedRadioElement).should('have.value', `${expectedYear}-${expectedMonth}-${expectedDay}`)
        }
      })
    return this
  }

  titleField = (): PageElement => cy.get('#title')

  stepTitleField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-title-field]`)

  stepStatusField = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-status-field]`)

  submitButton = (): PageElement => cy.get('[data-qa=goal-update-submit-button]')

  addAnotherStepButton = (): PageElement => cy.get('[data-qa=goal-update-add-another-step-button]')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  removeStepButton = (idx: number): PageElement => cy.get(`[data-qa=step-${idx}-remove-button]`)

  targetDateField = (): PageElement => cy.get('[name="targetCompletionDate"][type="radio"]')

  targetDateFieldDayField = (): PageElement => cy.get('#another-date-day')

  targetDateFieldMonthField = (): PageElement => cy.get('#another-date-month')

  targetDateFieldYearField = (): PageElement => cy.get('#another-date-year')
}
