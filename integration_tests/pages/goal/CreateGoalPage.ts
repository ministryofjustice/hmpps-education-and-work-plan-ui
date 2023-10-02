import Page, { PageElement } from '../page'

export default class CreateGoalPage extends Page {
  constructor() {
    super('create-goal')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  setGoalTitle(title: string) {
    this.titleField().clear().type(title)
    return this
  }

  clearGoalTitle() {
    this.titleField().clear()
    return this
  }

  setGoalTargetDate() {
    this.targetDateField().first().check()
    return this
  }

  setGoalCustomTargetDate(day: string, month: string, year: string) {
    this.targetDateField().last().check()
    this.targetDateFieldDayField().clear().type(day)
    this.targetDateFieldMonthField().clear().type(month)
    this.targetDateFieldYearField().clear().type(year)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  titleField = (): PageElement => cy.get('#title')

  targetDateField = (): PageElement => cy.get('[type="radio"]')

  targetDateFieldDayField = (): PageElement => cy.get('#another-date-day')

  targetDateFieldMonthField = (): PageElement => cy.get('#another-date-month')

  targetDateFieldYearField = (): PageElement => cy.get('#another-date-year')

  submitButton = (): PageElement => cy.get('button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
