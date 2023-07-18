import Page, { PageElement } from '../page'
import CreateGoalPage from '../goal/CreateGoalPage'

export default class OverviewPage extends Page {
  constructor() {
    super('overview')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasBackLinkForPrisoner(expected: string) {
    this.backLink().should('have.attr', 'href').and('contains', expected)
    return this
  }

  hasAddGoalButtonDisplayed() {
    this.addGoalButton().should('be.visible')
    return this
  }

  doesNotHaveAddGoalButton() {
    this.addGoalButton().should('not.exist')
    return this
  }

  clickAddGoalButton(): CreateGoalPage {
    this.addGoalButton().click()
    return Page.verifyOnPage(CreateGoalPage)
  }

  activeTabIs(expected: string) {
    this.activeTab().should('contain.text', expected)
    return this
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  addGoalButton = (): PageElement => cy.get('#add-goal-button')
}
