import Page, { PageElement } from '../page'
import SessionCompletedByValue from '../../../server/enums/sessionCompletedByValue'

export default class WhoCompletedInductionPage extends Page {
  constructor() {
    super('who-completed-induction')
  }

  selectWhoCompletedTheReview(value: SessionCompletedByValue): WhoCompletedInductionPage {
    this.radio(value).click()
    return this
  }

  enterFullName(value: string): WhoCompletedInductionPage {
    this.fullNameField().clear().type(value)
    return this
  }

  enterJobRole(value: string): WhoCompletedInductionPage {
    this.jobRoleField().clear().type(value)
    return this
  }

  setInductionDate(day: string, month: string, year: string): WhoCompletedInductionPage {
    this.inductionDateDayField().clear().type(day)
    this.inductionDateMonthField().clear().type(month)
    this.inductionDateYearField().clear().type(year)
    return this
  }

  private radio = (value: SessionCompletedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private inductionDateDayField = (): PageElement => cy.get('[data-qa=induction-date-day]')

  private inductionDateMonthField = (): PageElement => cy.get('[data-qa=induction-date-month]')

  private inductionDateYearField = (): PageElement => cy.get('[data-qa=induction-date-year]')

  private fullNameField = (): PageElement => cy.get('[data-qa=completedByOtherFullName]')

  private jobRoleField = (): PageElement => cy.get('[data-qa=completedByOtherJobRole]')
}
