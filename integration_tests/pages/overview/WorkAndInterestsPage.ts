import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Work And Interests tab of the Overview Page
 */
export default class WorkAndInterestsPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Work and interests')
  }

  activeTabIs(expected: string): WorkAndInterestsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  isShowingLongQuestionSetAnswers(): WorkAndInterestsPage {
    this.longQuestionSetContent().should('be.visible')
    this.shortQuestionSetContent().should('not.exist')
    return this
  }

  isShowingShortQuestionSetAnswers(): WorkAndInterestsPage {
    this.shortQuestionSetContent().should('be.visible')
    this.longQuestionSetContent().should('not.exist')
    return this
  }

  hasWorkInterests(): WorkAndInterestsPage {
    this.workInterestsSummaryCard().should('be.visible')
    return this
  }

  hasWorkExperienceDisplayed(): WorkAndInterestsPage {
    this.workExperienceSummaryCard().should('be.visible')
    return this
  }

  hasSkillsAndInterestsDisplayed(): WorkAndInterestsPage {
    this.skillsAndInterestSummaryCard().should('be.visible')
    return this
  }

  hasCiagInductionApiUnavailableMessageDisplayed(): WorkAndInterestsPage {
    this.ciagUnavailableMessage().should('be.exist')
    return this
  }

  hasLinkToCreateCiagInductionDisplayed(): WorkAndInterestsPage {
    this.createCiagInductionLink().should('be.visible')
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  workInterestsSummaryCard = (): PageElement => cy.get('#work-interests-summary-card')

  workExperienceSummaryCard = (): PageElement => cy.get('#work-experience-summary-card')

  skillsAndInterestSummaryCard = (): PageElement => cy.get('#skills-and-interests-summary-card')

  ciagUnavailableMessage = (): PageElement => cy.get('[data-qa=ciag-unavailable-message]')

  createCiagInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-ciag-induction]')

  longQuestionSetContent = (): PageElement => cy.get('[data-qa=work-and-interests-long-question-set')

  shortQuestionSetContent = (): PageElement => cy.get('[data-qa=work-and-interests-short-question-set')
}
