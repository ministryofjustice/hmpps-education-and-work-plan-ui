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

  submitPage() {
    this.submitButton().click()
  }

  addAnotherGoalButton = (): PageElement => cy.get('#add-another-goal-button')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
