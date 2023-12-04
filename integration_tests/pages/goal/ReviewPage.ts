import Page, { PageElement } from '../page'

export default class ReviewPage extends Page {
  constructor() {
    super('review')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
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

  hasStepDescription(expected: string) {
    this.goalStepValue(1).should('contain.text', expected)
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

  submitPage() {
    this.submitButton().click()
  }

  addAnotherGoalButton = (): PageElement => cy.get('#add-another-goal-button')

  goalDescriptionValue = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-description-value]`)

  changeGoalDescriptionLink = (idx: number): PageElement => cy.get(`[data-qa=change-goal-${idx}-description]`)

  goalTargetDateValue = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-target-date-value]`)

  changeGoalTargetDateLink = (idx: number): PageElement => cy.get(`[data-qa=change-goal-${idx}-target-date]`)

  goalStepValue = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-step-value]`)

  changeGoalStepLink = (idx: number, stepIdx: number): PageElement =>
    cy.get(`[data-qa=change-goal-${idx}-step-${stepIdx}]`)

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
