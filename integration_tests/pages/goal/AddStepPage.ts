import Page, { PageElement } from '../page'

export default class AddStepPage extends Page {
  constructor() {
    super('add-step')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasBackLinkForPrisoner(expected: string) {
    this.backLink().should('have.attr', 'href').and('contains', expected)
    return this
  }

  isStepNumber(expected: number) {
    this.stepNumberLabel().should('contain.text', `Step ${expected}`)
    return this
  }

  setStepTitle(title: string) {
    this.titleField().clear().type(title)
    return this
  }

  clearStepTitle() {
    this.titleField().clear()
    return this
  }

  setStepTargetDateRange(targetDateRange: string) {
    this.targetDateRangeField(targetDateRange).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  addAnotherStep() {
    this.addAnotherStepButton().click()
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  titleField = (): PageElement => cy.get('#title')

  targetDateRangeField = (targetDateRange: string): PageElement => cy.get(`input[type=radio][value=${targetDateRange}]`)

  addAnotherStepButton = (): PageElement => cy.get('#add-another-step-button')

  submitButton = (): PageElement => cy.get('#submit-button')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  stepNumberLabel = (): PageElement => cy.get('label[for=title]')
}
