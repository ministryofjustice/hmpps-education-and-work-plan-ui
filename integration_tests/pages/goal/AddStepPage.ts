import Page, { PageElement } from '../page'

export default class AddStepPage extends Page {
  constructor() {
    super('What are the steps to help them achieve')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  setStepTitle(title: string) {
    this.titleField().clear().type(title)
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

  titleField = (): PageElement => cy.get('#goal-title')

  targetDateDayField = (): PageElement => cy.get('#step-target-date-day')

  targetDateMonthField = (): PageElement => cy.get('#step-target-date-month')

  targetDateYearField = (): PageElement => cy.get('#step-target-date-year')

  addStepButton = (): PageElement => cy.get('#add-step-button')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
