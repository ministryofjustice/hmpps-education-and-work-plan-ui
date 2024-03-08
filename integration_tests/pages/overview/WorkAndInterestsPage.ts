import Page, { PageElement } from '../page'
import SkillsPage from '../induction/SkillsPage'
import PersonalInterestsPage from '../induction/PersonalInterestsPage'
import WorkedBeforePage from '../induction/WorkedBeforePage'
import AffectAbilityToWorkPage from '../induction/AffectAbilityToWorkPage'
import ReasonsNotToGetWorkPage from '../induction/ReasonsNotToGetWorkPage'
import PreviousWorkExperienceDetailPage from '../induction/PreviousWorkExperienceDetailPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import FutureWorkInterestTypesPage from '../induction/FutureWorkInterestTypesPage'
import PreviousWorkExperienceTypesPage from '../induction/PreviousWorkExperienceTypesPage'

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

  hasInductionUnavailableMessageDisplayed(): WorkAndInterestsPage {
    this.inductionUnavailableMessage().should('be.exist')
    return this
  }

  hasLinkToCreateInductionDisplayed(): WorkAndInterestsPage {
    this.createInductionLink().should('be.visible')
    return this
  }

  clickSkillsChangeLink(): SkillsPage {
    this.skillsChangeLink().click()
    return Page.verifyOnPage(SkillsPage)
  }

  clickPersonalInterestsChangeLink(): PersonalInterestsPage {
    this.personalInterestsChangeLink().click()
    return Page.verifyOnPage(PersonalInterestsPage)
  }

  clickWorkedBeforeChangeLink(): WorkedBeforePage {
    this.workedBeforeChangeLink().click()
    return Page.verifyOnPage(WorkedBeforePage)
  }

  clickAffectAbilityToWorkChangeLink(): AffectAbilityToWorkPage {
    this.affectAbilityToWorkChangeLink().click()
    return Page.verifyOnPage(AffectAbilityToWorkPage)
  }

  clickReasonsNotToGetWorkWorkChangeLink(): ReasonsNotToGetWorkPage {
    this.reasonsNotToGetWorkChangeLink().click()
    return Page.verifyOnPage(ReasonsNotToGetWorkPage)
  }

  clickFutureWorkInterestTypesChangeLink(): FutureWorkInterestTypesPage {
    this.futureWorkInterestTypesChangeLink().click()
    return Page.verifyOnPage(FutureWorkInterestTypesPage)
  }

  clickPreviousWorkExperienceTypesChangeLink(): PreviousWorkExperienceTypesPage {
    this.previousWorkExperienceTypesChangeLink().click()
    return Page.verifyOnPage(PreviousWorkExperienceTypesPage)
  }

  clickPreviousWorkExperienceDetailChangeLink(
    workExperienceType: TypeOfWorkExperienceValue,
  ): PreviousWorkExperienceDetailPage {
    this.previousWorkExperienceDetailChangeLink(workExperienceType).click()
    return Page.verifyOnPage(PreviousWorkExperienceDetailPage)
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  workInterestsSummaryCard = (): PageElement => cy.get('#work-interests-summary-card')

  workExperienceSummaryCard = (): PageElement => cy.get('#work-experience-summary-card')

  skillsAndInterestSummaryCard = (): PageElement => cy.get('#skills-and-interests-summary-card')

  inductionUnavailableMessage = (): PageElement => cy.get('[data-qa=induction-unavailable-message]')

  createInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-induction]')

  longQuestionSetContent = (): PageElement => cy.get('[data-qa=work-and-interests-long-question-set')

  shortQuestionSetContent = (): PageElement => cy.get('[data-qa=work-and-interests-short-question-set')

  skillsChangeLink = (): PageElement => cy.get('[data-qa=skills-change-link')

  personalInterestsChangeLink = (): PageElement => cy.get('[data-qa=personal-interests-change-link')

  workedBeforeChangeLink = (): PageElement => cy.get('[data-qa=has-worked-before-change-link')

  affectAbilityToWorkChangeLink = (): PageElement => cy.get('[data-qa=affect-ability-to-work-change-link')

  reasonsNotToGetWorkChangeLink = (): PageElement => cy.get('[data-qa=reasons-not-to-get-work-change-link')

  futureWorkInterestTypesChangeLink = (): PageElement => cy.get('[data-qa=work-interest-types-change-link')

  previousWorkExperienceTypesChangeLink = (): PageElement => cy.get(`[data-qa=previous-work-experience-change-link`)

  previousWorkExperienceDetailChangeLink = (workExperienceType: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=previous-work-experience-details-${workExperienceType}-change-link`)
}
