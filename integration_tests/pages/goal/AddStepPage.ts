import Page, { PageElement } from '../page'

export default class AddStepPage extends Page {
  constructor() {
    super('add-step')
  }

  isForPrisoner(expected: string): AddStepPage {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  isStepNumber(expected: number): AddStepPage {
    this.stepNumberLabel().should('contain.text', `Step ${expected}`)
    return this
  }

  isForGoalAndStepIndexes(expectedGoalIndex: number, expectedStepIndex: number): AddStepPage {
    cy.url().should('match', RegExp(`.*/goals/${expectedGoalIndex}/add-step/${expectedStepIndex}$`))
    return this
  }

  setStepTitle(title: string): AddStepPage {
    this.titleField().clear().type(title)
    return this
  }

  clearStepTitle(): AddStepPage {
    this.titleField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherStep(): AddStepPage {
    this.addAnotherStepButton().click()
    return this
  }

  titleField = (): PageElement => cy.get('#title')

  addAnotherStepButton = (): PageElement => cy.get('#add-another-step-button')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  stepNumberLabel = (): PageElement => cy.get('label[for=title]')
}
