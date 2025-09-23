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

  hasAlnAssessmentsDisplayed(): AdditionalNeedsPage {
    this.alnAssessments().should('be.visible')
    return this
  }

  hasLddAssessmentsDisplayed(): AdditionalNeedsPage {
    this.lddAssessments().should('be.visible')
    return this
  }

  hasCuriousAssessmentsUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.curiousAssessmentsUnavailableMessage().should('be.visible')
    return this
  }

  hasNoAssessmentsMessageDisplayed(): AdditionalNeedsPage {
    this.noAssessmentsMessage().should('be.visible')
    return this
  }

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private alnAssessments = (): PageElement => cy.get('[data-qa=aln-assessments]')

  private lddAssessments = (): PageElement => cy.get('[data-qa=ldd-assessments]')

  private curiousAssessmentsUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=curious-assessments-unavailable-message]')

  private noAssessmentsMessage = (): PageElement => cy.get('[data-qa=no-assessments-message]')
}
