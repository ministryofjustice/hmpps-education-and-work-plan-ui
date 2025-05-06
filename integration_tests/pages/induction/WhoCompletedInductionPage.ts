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

  setInductionDate(inductionDate: Date): WhoCompletedInductionPage {
    this.inductionDateField()
      .clear()
      .type(`${inductionDate.getDate()}/${inductionDate.getMonth() + 1}/${inductionDate.getFullYear()}`)
    return this
  }

  private radio = (value: SessionCompletedByValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private inductionDateField = (): PageElement => cy.get('#inductionDate')

  private fullNameField = (): PageElement => cy.get('[data-qa=completedByOtherFullName]')

  private jobRoleField = (): PageElement => cy.get('[data-qa=completedByOtherJobRole]')
}
