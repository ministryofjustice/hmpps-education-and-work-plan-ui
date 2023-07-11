import Page, { PageElement } from '../page'

export default class CreateGoalPage extends Page {
  constructor() {
    super('create-goal')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  setGoalTitle(title: string) {
    this.titleField().clear().type(title)
    return this
  }

  clearGoalTitle() {
    this.titleField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  titleField = (): PageElement => cy.get('#title')

  submitButton = (): PageElement => cy.get('button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')
}
