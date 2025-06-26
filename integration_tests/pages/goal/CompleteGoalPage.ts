import Page, { PageElement } from '../page'

export default class CompleteGoalPage extends Page {
  constructor() {
    super('complete-goal')
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  enterNotes(value: string): CompleteGoalPage {
    this.notesField().clear().type(value, { delay: 0 })
    return this
  }

  clearNotes(): CompleteGoalPage {
    this.notesField().clear()
    return this
  }

  private goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  private notesField = (): PageElement => cy.get('#notes')

  clickYes() {
    this.yesButton().click()
  }

  clickNo() {
    this.noButton().click()
  }

  private yesButton = (): PageElement => cy.get('[data-qa=goal-complete-submit-button]')

  private noButton = (): PageElement => cy.get('[data-qa=goal-complete-back-button]')
}
