import Page, { PageElement } from '../page'
import CompleteOrArchiveGoalValue from '../../../server/enums/CompleteOrArchiveGoalValue'

export default class CompleteOrArchiveGoalPage extends Page {
  constructor() {
    super('complete-or-archive-goal')
  }

  selectOption(value: CompleteOrArchiveGoalValue): CompleteOrArchiveGoalPage {
    this.radio(value).click()
    return this
  }

  private goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  private radio = (value: string): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
