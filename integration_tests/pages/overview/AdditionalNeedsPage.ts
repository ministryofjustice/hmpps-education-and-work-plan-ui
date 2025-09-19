import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Additional Needs tab of the Overview Page (previously known as Support Needs)
 */
export default class AdditionalNeedsPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Additional needs')
  }

  activeTabIs(expected: string): AdditionalNeedsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasHealthAndSupportNeedsDisplayed(): AdditionalNeedsPage {
    this.healthAndSupportNeedsSummaryCard().should('be.visible')
    return this
  }

  hasCuriousAssessmentsUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.curiousAssesmentsUnavailableMessage().should('be.exist')
    return this
  }

  hasNoAssessmentsMessageDisplayed(): AdditionalNeedsPage {
    this.noAssessmentsMessage().should('be.exist')
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  healthAndSupportNeedsSummaryCard = (): PageElement => cy.get('[data-qa=health-and-support-needs-summary-card]')

  curiousAssesmentsUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-assessments-unavailable-message]')

  noAssessmentsMessage = (): PageElement => cy.get('[data-qa=no-assessments-message]')
}
