import Page, { PageElement } from '../page'

export default class OverviewPage extends Page {
  constructor() {
    super('overview')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  activeTabIs(expected: string) {
    this.activeTab().should('have.text', expected)
    return this
  }

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')
}
