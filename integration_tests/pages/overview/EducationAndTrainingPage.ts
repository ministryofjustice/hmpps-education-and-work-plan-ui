import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'
import InPrisonCoursesAndQualificationsPage from '../inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import InPrisonTrainingPage from '../induction/InPrisonTrainingPage'
import HighestLevelOfEducationPage from '../induction/HighestLevelOfEducationPage'

/**
 * Cypress page class representing the Education And Training tab of the Overview Page
 */
export default class EducationAndTrainingPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Education and training')
  }

  activeTabIs(expected: string): EducationAndTrainingPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  isShowingLongQuestionSetAnswers(): EducationAndTrainingPage {
    this.longQuestionSetContent().should('be.visible')
    this.shortQuestionSetContent().should('not.exist')
    return this
  }

  isShowingShortQuestionSetAnswers(): EducationAndTrainingPage {
    this.shortQuestionSetContent().should('be.visible')
    this.longQuestionSetContent().should('not.exist')
    return this
  }

  hasFunctionalSkillsDisplayed(): EducationAndTrainingPage {
    this.functionalSkillsTable().should('be.visible')
    return this
  }

  doesNotHaveFunctionalSkillsDisplayed(): EducationAndTrainingPage {
    this.functionalSkillsTable().should('not.exist')
    return this
  }

  hasCompletedInPrisonQualificationsLast12MonthsDisplayed(): EducationAndTrainingPage {
    this.completedInPrisonQualificationsLast12MonthsTable().should('be.visible')
    return this
  }

  doesNotCompletedInPrisonQualificationsLast12MonthsDisplayed(): EducationAndTrainingPage {
    this.completedInPrisonQualificationsLast12MonthsTable().should('not.exist')
    return this
  }

  hasCuriousUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.curiousUnavailableMessage().should('be.exist')
    return this
  }

  hasInductionUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.inductionUnavailableMessage().should('be.exist')
    return this
  }

  hasLinkToCreateInductionDisplayed(): EducationAndTrainingPage {
    this.createInductionLink().should('be.visible')
    return this
  }

  clickToViewAllFunctionalSkills(): FunctionalSkillsPage {
    this.viewAllFunctionalSkillsButton().click()
    return Page.verifyOnPage(FunctionalSkillsPage)
  }

  clickViewAllCoursesAndQualificationsLink(): InPrisonCoursesAndQualificationsPage {
    this.viewAllCoursesAndQualificationsLink().click()
    return Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)
  }

  clickToChangeInPrisonTraining(): InPrisonTrainingPage {
    this.inPrisonTrainingChangeLink().click()
    return Page.verifyOnPage(InPrisonTrainingPage)
  }

  clickToChangeHighestLevelOfEducation(): HighestLevelOfEducationPage {
    this.highestLevelOfEducationChangeLink().click()
    return Page.verifyOnPage(HighestLevelOfEducationPage)
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  functionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  completedInPrisonQualificationsLast12MonthsTable = (): PageElement =>
    cy.get('#completed-in-prison-qualifications-last-12-months-table')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')

  viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')

  longQuestionSetContent = (): PageElement => cy.get('[data-qa=qualifications-and-education-history-long-question-set')

  shortQuestionSetContent = (): PageElement =>
    cy.get('[data-qa=qualifications-and-education-history-short-question-set')

  inductionUnavailableMessage = (): PageElement => cy.get('[data-qa=induction-unavailable-message]')

  createInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-induction]')

  viewAllCoursesAndQualificationsLink = (): PageElement => cy.get('[data-qa=view-all-in-prison-qualifications-link')

  inPrisonTrainingChangeLink = (): PageElement => cy.get('[data-qa=in-prison-training-change-link]')

  highestLevelOfEducationChangeLink = (): PageElement => cy.get('[data-qa=highest-level-of-education-change-link]')
}
