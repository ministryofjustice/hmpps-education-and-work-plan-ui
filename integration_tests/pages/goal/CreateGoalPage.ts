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

  setGoalReviewDate(day: number, month: number, year: number) {
    this.clearGoalReviewDate()
    this.reviewDateDayField().type(day.toString())
    this.reviewDateMonthField().type(month.toString())
    this.reviewDateYearField().type(year.toString())
    return this
  }

  clearGoalReviewDate() {
    this.reviewDateDayField().clear()
    this.reviewDateMonthField().clear()
    this.reviewDateYearField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  titleField = (): PageElement => cy.get('#title')

  reviewDateDayField = (): PageElement => cy.get('#reviewDate-day')

  reviewDateMonthField = (): PageElement => cy.get('#reviewDate-month')

  reviewDateYearField = (): PageElement => cy.get('#reviewDate-year')

  submitButton = (): PageElement => cy.get('button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
