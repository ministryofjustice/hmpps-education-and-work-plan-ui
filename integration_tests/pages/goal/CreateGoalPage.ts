import Page, { PageElement } from '../page'

export default class CreateGoalPage extends Page {
  constructor() {
    super('create-goal')
  }

  setGoalTitle(title: string): CreateGoalPage {
    this.titleField().clear().type(title)
    return this
  }

  clearGoalTitle(): CreateGoalPage {
    this.titleField().clear()
    return this
  }

  setTargetCompletionDate0to3Months(): CreateGoalPage {
    this.targetDateField().first().check()
    return this
  }

  setTargetCompletionDate(day: string, month: string, year: string): CreateGoalPage {
    this.targetDateField().last().check()
    this.targetDateFieldDayField().clear().type(day)
    this.targetDateFieldMonthField().clear().type(month)
    this.targetDateFieldYearField().clear().type(year)
    return this
  }

  hasTargetCompletionDateValue(expectedDay: string, expectedMonth: string, expectedYear: string): CreateGoalPage {
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

  submitPage() {
    this.submitButton().click()
  }

  isForGoalIndex(expectedGoalIndex: number): CreateGoalPage {
    cy.url().should('match', RegExp(`.*/goals/${expectedGoalIndex}/create$`))
    return this
  }

  titleField = (): PageElement => cy.get('#title')

  targetDateField = (): PageElement => cy.get('[name="targetCompletionDate"][type="radio"]')

  targetDateFieldDayField = (): PageElement => cy.get('#another-date-day')

  targetDateFieldMonthField = (): PageElement => cy.get('#another-date-month')

  targetDateFieldYearField = (): PageElement => cy.get('#another-date-year')

  submitButton = (): PageElement => cy.get('button')
}
