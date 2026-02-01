import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Employability Skills tab of the Overview Page
 */
export default class EmployabilitySkillsPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Employability skills')
  }

  activeTabIs(expected: string): EmployabilitySkillsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')
}
