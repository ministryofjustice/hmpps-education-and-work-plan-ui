import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'
import InPrisonCoursesAndQualificationsPage from '../inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import InPrisonTrainingPage from '../induction/InPrisonTrainingPage'
import HighestLevelOfEducationPage from '../prePrisonEducation/HighestLevelOfEducationPage'
import AdditionalTrainingPage from '../induction/AdditionalTrainingPage'
import QualificationsListPage from '../prePrisonEducation/QualificationsListPage'
import QualificationLevelPage from '../prePrisonEducation/QualificationLevelPage'
import LrsQualificationsPage from '../lrsQualifications/LrsQualificationsPage'

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

  hasFunctionalSkillWithAssessmentScoreDisplayed(
    expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY',
  ): EducationAndTrainingPage {
    this.functionalSkillsTable().should('be.visible')
    this.functionalSkillRow(expectedType).should('be.visible')
    this.noFunctionalSkillsMessage().should('not.exist')
    return this
  }

  hasNoFunctionalSkillsRecorded(): EducationAndTrainingPage {
    this.noFunctionalSkillsMessage().should('be.visible')
    this.doesNotHaveFunctionalSkillsTableDisplayed()
    return this
  }

  doesNotHaveFunctionalSkillsTableDisplayed(): EducationAndTrainingPage {
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

  hasEducationOrInductionUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.educationOrInductionUnavailableMessage().should('be.visible')
    return this
  }

  hasAddEducationMessageDisplayed(): EducationAndTrainingPage {
    this.addEducationHistory().should('be.exist')
    return this
  }

  hasHighestLevelOfEducationMessageDisplayed(): EducationAndTrainingPage {
    this.addEducationHistory().should('be.exist')
    return this
  }

  hasEducationQualificationsDisplayed(): EducationAndTrainingPage {
    this.educationTable().should('be.exist')
    return this
  }

  hasNoEducationQualificationsDisplayed(): EducationAndTrainingPage {
    this.educationTable().should('not.exist')
    return this
  }

  hasLinkToCreateInductionDisplayed(): EducationAndTrainingPage {
    this.createInductionLink().should('be.visible')
    return this
  }

  clickToViewAllFunctionalSkills(): FunctionalSkillsPage {
    cy.get('[data-qa=view-all-functional-skills-button]').should('be.visible').as('functionalSkillsButton')
    cy.get('@functionalSkillsButton').first().click()
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

  inPrisonTrainingChangeLinkHasText(expected: string): EducationAndTrainingPage {
    this.inPrisonTrainingChangeLink().should('contain.text', expected)
    return this
  }

  clickToChangeHighestLevelOfEducation(): HighestLevelOfEducationPage {
    this.highestLevelOfEducationChangeLink().click()
    return Page.verifyOnPage(HighestLevelOfEducationPage)
  }

  highestLevelOfEducationChangeLinkHasText(expected: string): EducationAndTrainingPage {
    this.highestLevelOfEducationChangeLink().should('contain.text', expected)
    return this
  }

  clickToChangeAdditionalTraining(): AdditionalTrainingPage {
    this.additionalTrainingChangeLink().click()
    return Page.verifyOnPage(AdditionalTrainingPage)
  }

  clickToChangeEducationalQualifications(): QualificationsListPage {
    this.educationalQualificationsChangeLink().click()
    return Page.verifyOnPage(QualificationsListPage)
  }

  clickToAddEducationalQualifications(): QualificationLevelPage {
    this.educationalQualificationsChangeLink().click()
    return Page.verifyOnPage(QualificationLevelPage)
  }

  hasNoCompletedCoursesInLast12MonthsDisplayed(): EducationAndTrainingPage {
    this.noCompletedCoursesInLast12MonthsMessage().should('be.visible')
    return this
  }

  clickToAddEducationHistory(): HighestLevelOfEducationPage {
    this.addEducationHistory().click()
    return Page.verifyOnPage(HighestLevelOfEducationPage)
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  functionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  noFunctionalSkillsMessage = (): PageElement => cy.get('[data-qa=no-functional-skills-in-curious-message]')

  functionalSkillRow = (expectedType: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'): PageElement =>
    cy.get(`[data-qa=functional-skill-${expectedType}]`)

  completedInPrisonCoursesInLast12MonthsTable = (): PageElement =>
    cy.get('#completed-in-prison-courses-in-last-12-months-table')

  hasVerifiedQualificationsDisplayed(): EducationAndTrainingPage {
    this.verifiedQualifications().should('be.visible')
    return this
  }

  hasLearnerNotMatchedMessageDisplayed(): EducationAndTrainingPage {
    this.learnerNotMatchedMessage().should('be.visible')
    return this
  }

  hasLearnerRecordsUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.learnerRecordsUnavailableMessage().should('be.visible')
    return this
  }

  clickToViewAllLrsQualifications(): LrsQualificationsPage {
    this.viewAllLrsQualificationsButton().click()
    return Page.verifyOnPage(LrsQualificationsPage)
  }

  private curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')

  private viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')

  private educationOrInductionUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=education-or-induction-unavailable-message]')

  private addEducationHistory = (): PageElement => cy.get('[data-qa=link-to-add-educational-qualifications]')

  private educationTable = (): PageElement => cy.get('[data-qa=educational-qualifications-table]')

  private createInductionLink = (): PageElement => cy.get('[data-qa=link-to-create-induction]')

  private viewAllInPrisonCoursesLink = (): PageElement => cy.get('[data-qa=view-all-in-prison-courses-link]')

  private inPrisonTrainingChangeLink = (): PageElement => cy.get('[data-qa=in-prison-training-change-link]')

  private highestLevelOfEducationChangeLink = (): PageElement =>
    cy.get('[data-qa=highest-level-of-education-change-link]')

  private additionalTrainingChangeLink = (): PageElement => cy.get('[data-qa=additional-training-change-link]')

  private educationalQualificationsChangeLink = (): PageElement =>
    cy.get('[data-qa=educational-qualifications-change-link]')

  private noCompletedCoursesInLast12MonthsMessage = (): PageElement =>
    cy.get('[data-qa=no-completed-courses-in-last-12-months-message]')

  private completedCourseWithName = (expectedCourseName: string): PageElement =>
    cy.get(`[data-qa=completed-course-name]:contains(${expectedCourseName})`)

  private verifiedQualifications = (): PageElement => cy.get('[data-qa=verified-qualifications]')

  private learnerMatchedButHasNoQualificationsMessage = (): PageElement =>
    cy.get('[data-qa=learner-matched-but-has-no-qualifications-message]')

  private learnerNotMatchedMessage = (): PageElement => cy.get('[data-qa=not-matched-in-lrs-message]')

  private learnerDeclinedToShareDataMessage = (): PageElement =>
    cy.get('[data-qa=learner-declined-to-share-data-message]')

  private learnerRecordsUnavailableMessage = (): PageElement => cy.get('[data-qa=learner-records-unavailable-message]')

  private viewAllLrsQualificationsButton = (): PageElement => cy.get('[data-qa=view-all-lrs-qualifications-link]')
}
