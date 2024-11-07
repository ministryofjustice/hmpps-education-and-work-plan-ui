import Page, { PageElement } from '../page'
import SkillsPage from '../induction/SkillsPage'
import PersonalInterestsPage from '../induction/PersonalInterestsPage'
import WorkedBeforePage from '../induction/WorkedBeforePage'
import AffectAbilityToWorkPage from '../induction/AffectAbilityToWorkPage'
import PreviousWorkExperienceDetailPage from '../induction/PreviousWorkExperienceDetailPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import FutureWorkInterestTypesPage from '../induction/FutureWorkInterestTypesPage'
import FutureWorkInterestRolesPage from '../induction/FutureWorkInterestRolesPage'
import PreviousWorkExperienceTypesPage from '../induction/PreviousWorkExperienceTypesPage'
import InPrisonWorkPage from '../induction/InPrisonWorkPage'
import HopingToWorkOnReleasePage from '../induction/HopingToWorkOnReleasePage'
import AuthorisationErrorPage from '../authorisationError'

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

  hasWorkInterestsDisplayed(): WorkAndInterestsPage {
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

  hasInPrisonWorkInterestsSummaryCardDisplayed(): WorkAndInterestsPage {
    this.inPrisonWorkInterestsSummaryCard().should('be.visible')
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

  skillsChangeLinkHasText(expected: string): WorkAndInterestsPage {
    this.skillsChangeLink().should('contain.text', expected)
    return this
  }

  clickPersonalInterestsChangeLink(): PersonalInterestsPage {
    this.personalInterestsChangeLink().click()
    return Page.verifyOnPage(PersonalInterestsPage)
  }

  clickPersonalInterestsChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.personalInterestsChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  personalInterestsChangeLinkHasText(expected: string): WorkAndInterestsPage {
    this.personalInterestsChangeLink().should('contain.text', expected)
    return this
  }

  clickWorkedBeforeChangeLink(): WorkedBeforePage {
    this.workedBeforeChangeLink().click()
    return Page.verifyOnPage(WorkedBeforePage)
  }

  clickHopingToWorkOnReleaseChangeLink(): HopingToWorkOnReleasePage {
    this.hopingToWorkOnReleaseChangeLink().click()
    return Page.verifyOnPage(HopingToWorkOnReleasePage)
  }

  clickHopingToWorkOnReleaseChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.hopingToWorkOnReleaseChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  clickAffectAbilityToWorkChangeLink(): AffectAbilityToWorkPage {
    this.affectAbilityToWorkChangeLink().click()
    return Page.verifyOnPage(AffectAbilityToWorkPage)
  }

  clickAffectAbilityToWorkChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.affectAbilityToWorkChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  clickFutureWorkInterestTypesChangeLink(): FutureWorkInterestTypesPage {
    this.futureWorkInterestTypesChangeLink().click()
    return Page.verifyOnPage(FutureWorkInterestTypesPage)
  }

  clickFutureWorkInterestTypesChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.futureWorkInterestTypesChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  clickFutureWorkInterestRolesChangeLink(): FutureWorkInterestRolesPage {
    this.futureWorkInterestRolesChangeLink().click()
    return Page.verifyOnPage(FutureWorkInterestRolesPage)
  }

  clickFutureWorkInterestRolesChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.futureWorkInterestRolesChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  doesNotHaveFutureWorkInterestRolesChangeLink(): WorkAndInterestsPage {
    this.futureWorkInterestRolesChangeLink().should('not.exist')
    return this
  }

  clickPreviousWorkExperienceTypesChangeLink(): PreviousWorkExperienceTypesPage {
    this.previousWorkExperienceTypesChangeLink().click()
    return Page.verifyOnPage(PreviousWorkExperienceTypesPage)
  }

  clickPreviousWorkExperienceTypesChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.previousWorkExperienceTypesChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  clickPreviousWorkExperienceDetailChangeLink(
    workExperienceType: TypeOfWorkExperienceValue,
  ): PreviousWorkExperienceDetailPage {
    this.previousWorkExperienceDetailChangeLink(workExperienceType).click()
    return Page.verifyOnPage(PreviousWorkExperienceDetailPage)
  }

  clickPreviousWorkExperienceDetailChangeLinkReadOnlyUser(
    workExperienceType: TypeOfWorkExperienceValue,
  ): AuthorisationErrorPage {
    this.previousWorkExperienceDetailChangeLink(workExperienceType).click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  clickInPrisonWorkChangeLink(): InPrisonWorkPage {
    this.inPrisonWorkChangeLink().click()
    return Page.verifyOnPage(InPrisonWorkPage)
  }

  clickInPrisonWorkChangeLinkReadOnlyUser(): AuthorisationErrorPage {
    this.inPrisonWorkChangeLink().click()
    return Page.verifyOnPage(AuthorisationErrorPage)
  }

  inPrisonWorkChangeLinkHasText(expected: string): WorkAndInterestsPage {
    this.inPrisonWorkChangeLink().should('contain.text', expected)
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  workInterestsSummaryCard = (): PageElement => cy.get('#work-interests-summary-card')

  workExperienceSummaryCard = (): PageElement => cy.get('#work-experience-summary-card')

  skillsAndInterestSummaryCard = (): PageElement => cy.get('#skills-and-interests-summary-card')

  inPrisonWorkInterestsSummaryCard = (): PageElement => cy.get('#in-prison-work-interests-summary-card')

  inductionUnavailableMessage = (): PageElement => cy.get('[data-qa=induction-unavailable-message]')

  createInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-induction]')

  skillsChangeLink = (): PageElement => cy.get('[data-qa=skills-change-link')

  personalInterestsChangeLink = (): PageElement => cy.get('[data-qa=personal-interests-change-link')

  workedBeforeChangeLink = (): PageElement => cy.get('[data-qa=has-worked-before-change-link')

  hopingToWorkOnReleaseChangeLink = (): PageElement => cy.get('[data-qa=hoping-to-work-on-release-change-link')

  affectAbilityToWorkChangeLink = (): PageElement => cy.get('[data-qa=affect-ability-to-work-change-link')

  futureWorkInterestTypesChangeLink = (): PageElement => cy.get('[data-qa=work-interest-types-change-link')

  futureWorkInterestRolesChangeLink = (): PageElement => cy.get('[data-qa=work-interest-roles-change-link')

  previousWorkExperienceTypesChangeLink = (): PageElement => cy.get(`[data-qa=previous-work-experience-change-link`)

  previousWorkExperienceDetailChangeLink = (workExperienceType: TypeOfWorkExperienceValue): PageElement =>
    cy.get(`[data-qa=previous-work-experience-details-${workExperienceType}-change-link`)

  inPrisonWorkChangeLink = (): PageElement => cy.get('[data-qa=in-prison-work-change-link')
}
