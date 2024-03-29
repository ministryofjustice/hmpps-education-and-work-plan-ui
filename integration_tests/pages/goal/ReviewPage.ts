import Page, { PageElement } from '../page'

export default class ReviewPage extends Page {
  constructor() {
    super('review')
  }

  addAnotherGoal() {
    this.addAnotherGoalButton().click()
  }

  hasGoalDescription(expected: string) {
    this.goalDescriptionValue(1).should('contain.text', expected)
    return this
  }

  hasGoalTargetDate(expected: string) {
    this.goalTargetDateValue(1).should('contain.text', expected)
    return this
  }

  hasStepDescription(expected: string, stepValue: number) {
    this.goalStepValue(1, stepValue).should('contain.text', expected)
    return this
  }

  hasNote(expected: string) {
    this.goalNoteValue(1).should('contain.text', expected)
    return this
  }

  clickChangeGoalDescriptionLink() {
    this.changeGoalDescriptionLink(1).click()
  }

  clickChangeGoalTargetDateLink() {
    this.changeGoalTargetDateLink(1).click()
  }

  clickChangeGoalStepLink() {
    this.changeGoalStepLink(1, 1).click()
  }

  clickChangeGoalNoteLink() {
    this.changeGoalNote(1).click()
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherGoalButton = (): PageElement => cy.get('#add-another-goal-button')

  goalDescriptionValue = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-description-value]`)

  changeGoalDescriptionLink = (idx: number): PageElement => cy.get(`[data-qa=change-goal-${idx}-description]`)

  goalTargetDateValue = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-target-date-value]`)

  changeGoalTargetDateLink = (idx: number): PageElement => cy.get(`[data-qa=change-goal-${idx}-target-date]`)

  goalStepValue = (goalIdx: number, stepIdx: number): PageElement =>
    cy.get(`[data-qa=goal-${goalIdx}-step-${stepIdx}-value]`)

  changeGoalStepLink = (goalIdx: number, stepIdx: number): PageElement =>
    cy.get(`[data-qa=change-goal-${goalIdx}-step-${stepIdx}]`)

  goalNoteValue = (goalIdx: number): PageElement => cy.get(`[data-qa=goal-${goalIdx}-note-value]`)

  changeGoalNote = (idx: number): PageElement => cy.get(`[data-qa=change-goal-${idx}-note]`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
