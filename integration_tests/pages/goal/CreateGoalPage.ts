import Page, { PageElement } from '../page'

export default class CreateGoalPage extends Page {
  constructor() {
    super('Describe the goal you want to create')
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
    this.reviewDateDayField().clear().type(day.toString())
    this.reviewDateMonthField().clear().type(month.toString())
    this.reviewDateYearField().clear().type(year.toString())
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
