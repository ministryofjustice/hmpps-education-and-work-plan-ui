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

  hasFunctionalSkillWithAssessmentScoreDisplayed(
    expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY',
  ): EducationAndTrainingPage {
    this.functionalSkillsTable().should('be.visible')
    this.functionalSkillRow(expectedType).should('be.visible')
    this.noAssessmentScoreMessageForFunctionalSkill(expectedType).should('not.exist')
    return this
  }

  hasFunctionalSkillWithNoAssessmentScoreMessageDisplayed(
    expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY',
  ): EducationAndTrainingPage {
    this.functionalSkillsTable().should('be.visible')
    this.functionalSkillRow(expectedType).should('be.visible')
    this.noAssessmentScoreMessageForFunctionalSkill(expectedType).should('be.visible')
    return this
  }

  doesNotHaveFunctionalSkillsDisplayed(): EducationAndTrainingPage {
    this.functionalSkillsTable().should('not.exist')
    return this
  }

  hasCompletedCourseInLast12MonthsDisplayed(expectedCourseName: string): EducationAndTrainingPage {
    this.completedInPrisonCoursesInLast12MonthsTable().should('be.visible')
    this.completedCourseWithName(expectedCourseName).should('be.visible')
    this.noCompletedCoursesInLast12MonthsMessage().should('not.exist')
    return this
  }

  doesNotHaveCompletedCoursesInLast12MonthsDisplayed(): EducationAndTrainingPage {
    this.completedInPrisonCoursesInLast12MonthsTable().should('not.exist')
    return this
  }

  hasCuriousUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.curiousUnavailableMessage().should('be.visible')
    return this
  }

  hasInductionUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.inductionUnavailableMessage().should('be.visible')
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

  hasLinkToViewAllCourses(): EducationAndTrainingPage {
    this.viewAllInPrisonCoursesLink().should('be.visible')
    return this
  }

  clickViewAllCoursesLink(): InPrisonCoursesAndQualificationsPage {
    this.viewAllInPrisonCoursesLink().click()
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

  doesNotHaveLinkToViewAllCourses(): EducationAndTrainingPage {
    this.viewAllInPrisonCoursesLink().should('not.exist')
    return this
  }

  hasNoCompletedCoursesInLast12MonthsDisplayed(): EducationAndTrainingPage {
    this.noCompletedCoursesInLast12MonthsMessage().should('be.visible')
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  functionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  functionalSkillRow = (expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'): PageElement =>
    cy.get(`[data-qa=functional-skill-${expectedType}]`)

  noAssessmentScoreMessageForFunctionalSkill = (expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'): PageElement =>
    cy.get(`[data-qa=no-assessment-score-for-functional-skill-for-${expectedType}]`)

  completedInPrisonCoursesInLast12MonthsTable = (): PageElement =>
    cy.get('#completed-in-prison-courses-in-last-12-months-table')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')

  viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')

  longQuestionSetContent = (): PageElement => cy.get('[data-qa=qualifications-and-education-history-long-question-set')

  shortQuestionSetContent = (): PageElement =>
    cy.get('[data-qa=qualifications-and-education-history-short-question-set')

  inductionUnavailableMessage = (): PageElement => cy.get('[data-qa=induction-unavailable-message]')

  createInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-induction]')

  viewAllInPrisonCoursesLink = (): PageElement => cy.get('[data-qa=view-all-in-prison-courses-link]')

  inPrisonTrainingChangeLink = (): PageElement => cy.get('[data-qa=in-prison-training-change-link]')

  highestLevelOfEducationChangeLink = (): PageElement => cy.get('[data-qa=highest-level-of-education-change-link]')

  additionalTrainingChangeLink = (): PageElement => cy.get('[data-qa=additional-training-change-link]')

  educationalQualificationsChangeLink = (): PageElement => cy.get('[data-qa=educational-qualifications-change-link]')

  noCompletedCoursesInLast12MonthsMessage = (): PageElement =>
    cy.get('[data-qa=no-completed-courses-in-last-12-months-message]')

  completedCourseWithName = (expectedCourseName: string): PageElement =>
    cy.get(`[data-qa=completed-course-name]:contains(${expectedCourseName})`)
}
