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

  hasStrengthsDisplayed(): AdditionalNeedsPage {
    this.sanStrengths().should('be.visible')
    return this
  }

  hasNoStrengthsMessageDisplayed(): AdditionalNeedsPage {
    this.noStrengthsMessage().should('be.visible')
    return this
  }

  hasStrengthsUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.sanStrengthsUnavailableMessage().should('be.visible')
    return this
  }

  hasChallengesDisplayed(): AdditionalNeedsPage {
    this.sanChallenges().should('be.visible')
    return this
  }

  hasNoChallengesMessageDisplayed(): AdditionalNeedsPage {
    this.noChallengesMessage().should('be.visible')
    return this
  }

  hasChallengesUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.sanChallengesUnavailableMessage().should('be.visible')
    return this
  }

  hasSupportStrategiesDisplayed(): AdditionalNeedsPage {
    this.sanSupportStrategies().should('be.visible')
    return this
  }

  hasNoSupportStrategiesMessageDisplayed(): AdditionalNeedsPage {
    this.noSupportStrategiesMessage().should('be.visible')
    return this
  }

  hasSupportStrategiesUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.sanSupportStrategiesUnavailableMessage().should('be.visible')
    return this
  }

  hasSelfDeclaredConditionsDisplayed(): AdditionalNeedsPage {
    this.sanSelfDeclaredConditions().should('be.visible')
    return this
  }

  hasConfirmedDiagnosisConditionsDisplayed(): AdditionalNeedsPage {
    this.sanConfirmedDiagnosisConditions().should('be.visible')
    return this
  }

  hasNoConditionsMessageDisplayed(): AdditionalNeedsPage {
    this.noConditionsMessage().should('be.visible')
    return this
  }

  hasConditionsUnavailableMessageDisplayed(): AdditionalNeedsPage {
    this.sanConditionsUnavailableMessage().should('be.visible')
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

  private sanStrengths = (): PageElement => cy.get('[data-qa=san-strengths-list]')

  private noStrengthsMessage = (): PageElement => cy.get('[data-qa=no-strengths-recorded-message]')

  private sanStrengthsUnavailableMessage = (): PageElement => cy.get('[data-qa=san-strengths-unavailable-message]')

  private sanChallenges = (): PageElement => cy.get('[data-qa=san-challenges-list]')

  private noChallengesMessage = (): PageElement => cy.get('[data-qa=no-challenges-recorded-message]')

  private sanChallengesUnavailableMessage = (): PageElement => cy.get('[data-qa=san-challenges-unavailable-message]')

  private sanSupportStrategies = (): PageElement => cy.get('[data-qa=support-strategies-summary-list]')

  private noSupportStrategiesMessage = (): PageElement => cy.get('[data-qa=no-support-strategies-recorded-message]')

  private sanSupportStrategiesUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=support-strategies-unavailable-message]')

  private sanSelfDeclaredConditions = (): PageElement => cy.get('[data-qa=self-declared-conditions]')

  private sanConfirmedDiagnosisConditions = (): PageElement => cy.get('[data-qa=confirmed-diagnosis-conditions]')

  private noConditionsMessage = (): PageElement => cy.get('[data-qa=no-conditions-message]')

  private sanConditionsUnavailableMessage = (): PageElement => cy.get('[data-qa=san-conditions-unavailable-message]')

  private alnAssessments = (): PageElement => cy.get('[data-qa=aln-assessments]')

  private lddAssessments = (): PageElement => cy.get('[data-qa=ldd-assessments]')

  private curiousAssessmentsUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=curious-assessments-unavailable-message]')

  private noAssessmentsMessage = (): PageElement => cy.get('[data-qa=no-assessments-message]')
}
