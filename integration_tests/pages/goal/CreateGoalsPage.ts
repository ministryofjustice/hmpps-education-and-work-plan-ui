import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the "Create Goals" page
 */
export default class CreateGoalsPage extends Page {
  constructor() {
    super('create-goals')
  }

  setGoalTitle(title: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalTitleField(goalNumber).clear().type(title)
    return this
  }

  clearGoalTitle(goalNumber: number = 1): CreateGoalsPage {
    this.goalTitleField(goalNumber).clear()
    return this
  }

  setTargetCompletionDate0to3Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(0).check() // 0-3 months option is the first radio button (zero indexed)
    return this
  }

  setTargetCompletionDate3to6Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(1).check() // 3-6 months option is the 2nd radio button (zero indexed)
    return this
  }

  setTargetCompletionDate6to12Months(goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).eq(2).check() // 6-12 months option is the 3rd radio button (zero indexed)
    return this
  }

  setTargetCompletionDate(day: string, month: string, year: string, goalNumber: number = 1): CreateGoalsPage {
    this.goalTargetDateRadioButtons(goalNumber).last().check() // Setting a custom date is the last radio button option
    this.goalTargetDateDayField(goalNumber).clear().type(day)
    this.goalTargetDateMonthField(goalNumber).clear().type(month)
    this.goalTargetDateYearField(goalNumber).clear().type(year)
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  private zeroIndexedGoalNumber = (goalNumber: number): number => Math.min(0, goalNumber - 1)

  private goalTitleField = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexedGoalNumber(goalNumber)}][title]"]`)

  private goalTargetDateRadioButtons = (goalNumber: number): PageElement =>
    cy.get(`[name="goals[${this.zeroIndexedGoalNumber(goalNumber)}][targetCompletionDate]"][type="radio"]`)

  private goalTargetDateDayField = (goalNumber: number): PageElement =>
    cy.get(`[name="${this.zeroIndexedGoalNumber(goalNumber)}][targetCompletionDate-day]"]`)

  private goalTargetDateMonthField = (goalNumber: number): PageElement =>
    cy.get(`[name="${this.zeroIndexedGoalNumber(goalNumber)}][targetCompletionDate-month]"]`)

  private goalTargetDateYearField = (goalNumber: number): PageElement =>
    cy.get(`[name="${this.zeroIndexedGoalNumber(goalNumber)}][targetCompletionDate-year]"]`)

  private submitButton = (): PageElement => cy.get('#submit-button')
}
