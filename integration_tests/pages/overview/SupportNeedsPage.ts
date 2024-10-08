import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Support Needs tab of the Overview Page
 */
export default class SupportNeedsPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Support needs')
  }

  activeTabIs(expected: string): SupportNeedsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasHealthAndSupportNeedsDisplayed(): SupportNeedsPage {
    this.healthAndSupportNeedsSummaryCard().should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageDisplayed(): SupportNeedsPage {
    this.curiousUnavailableMessage().should('be.exist')
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  healthAndSupportNeedsSummaryCard = (): PageElement => cy.get('#health-and-support-needs-summary-card')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')
}
