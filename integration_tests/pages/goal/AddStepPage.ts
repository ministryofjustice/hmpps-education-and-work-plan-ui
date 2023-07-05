import Page, { PageElement } from '../page'

export default class AddStepPage extends Page {
  constructor() {
    super('What are the steps to help them achieve')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  isForGoal(expected: string) {
    this.goalTitle().should('contain.text', expected)
    return this
  }

  isStepNumber(expected: number) {
    this.stepNumberLabel().should('contain.text', `Step ${expected}`)
    return this
  }

  setStepTitle(title: string) {
    this.titleField().clear().type(title)
    return this
  }

  clearStepTitle() {
    this.titleField().clear()
    return this
  }

  setStepTargetDate(day: number, month: number, year: number) {
    this.targetDateDayField().clear().type(day.toString())
    this.targetDateMonthField().clear().type(month.toString())
    this.targetDateYearField().clear().type(year.toString())
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherStep() {
    this.addAnotherStepButton().click()
  }

  goalTitle = (): PageElement => cy.get('h1')

  titleField = (): PageElement => cy.get('#title')

  targetDateDayField = (): PageElement => cy.get('#targetDate-day')

  targetDateMonthField = (): PageElement => cy.get('#targetDate-month')

  targetDateYearField = (): PageElement => cy.get('#targetDate-year')

  addAnotherStepButton = (): PageElement => cy.get('#add-another-step-button')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  stepNumberLabel = (): PageElement => cy.get('label[for=title]')
}
