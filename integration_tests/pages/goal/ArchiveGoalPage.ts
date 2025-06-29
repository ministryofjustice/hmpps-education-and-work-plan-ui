import Page, { PageElement } from '../page'
import ReasonToArchiveGoalValue from '../../../server/enums/ReasonToArchiveGoalValue'

export default class ArchiveGoalPage extends Page {
  constructor() {
    super('archive-goal')
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  selectReason(value: ReasonToArchiveGoalValue): ArchiveGoalPage {
    this.radio(value).click()
    return this
  }

  enterReason(value: string): ArchiveGoalPage {
    this.reasonOther().type(value, { delay: 0 })
    return this
  }

  shouldHaveOtherReasonHint(expected: string): ArchiveGoalPage {
    this.reasonOtherHint().should('contain', expected)
    return this
  }

  enterNotes(value: string): ArchiveGoalPage {
    this.notesField().clear().type(value, { delay: 0 })
    return this
  }

  clearNotes(): ArchiveGoalPage {
    this.notesField().clear()
    return this
  }

  private goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  private radio = (value: ReasonToArchiveGoalValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private reasonOther = (): PageElement => cy.get('#reasonOther')

  private reasonOtherHint = (): PageElement => cy.get('.govuk-character-count__status')

  private notesField = (): PageElement => cy.get('#notes')
}
