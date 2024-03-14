import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'
import InPrisonCoursesAndQualificationsPage from '../inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import InPrisonTrainingPage from '../induction/InPrisonTrainingPage'
import HighestLevelOfEducationPage from '../induction/HighestLevelOfEducationPage'
import AdditionalTrainingPage from '../induction/AdditionalTrainingPage'
import QualificationsListPage from '../induction/QualificationsListPage'

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
    this.completedQualificationCourseName().should('be.exist')
    this.noCoursesAndQualificationsLast12MonthsMessage().should('not.exist')
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

  coursesAndQualificationsLinkShouldExist(): EducationAndTrainingPage {
    this.viewAllCoursesAndQualificationsLink().should('be.exist')
    return this
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

  clickToChangeAdditionalTraining(): AdditionalTrainingPage {
    this.additionalTrainingChangeLink().click()
    return Page.verifyOnPage(AdditionalTrainingPage)
  }

  clickToChangeEducationalQualifications(): QualificationsListPage {
    this.educationalQualificationsChangeLink().click()
    return Page.verifyOnPage(QualificationsListPage)
  }

  coursesAndQualificationsLinkShouldNotExist(): EducationAndTrainingPage {
    this.viewAllCoursesAndQualificationsLink().should('not.exist')
    return this
  }

  hasNoCoursesAndQualificationsLast12MonthsMessageDisplayed(): EducationAndTrainingPage {
    this.noCoursesAndQualificationsLast12MonthsMessage().should('be.exist')
    return this
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

  additionalTrainingChangeLink = (): PageElement => cy.get('[data-qa=additional-training-change-link]')

  educationalQualificationsChangeLink = (): PageElement => cy.get('[data-qa=educational-qualifications-change-link]')

  noCoursesAndQualificationsLast12MonthsMessage = (): PageElement =>
    cy.get('[data-qa=no-courses-or-qualifications-last-12-months-message]')

  completedQualificationCourseName = (): PageElement => cy.get('[data-qa=completed-qualification-course-name]')
}
