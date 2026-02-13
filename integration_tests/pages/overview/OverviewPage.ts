import Page, { PageElement } from '../page'
import CreateGoalsPage from '../goal/CreateGoalsPage'
import HopingToWorkOnReleasePage from '../induction/HopingToWorkOnReleasePage'
import EducationAndTrainingPage from './EducationAndTrainingPage'
import GoalsPage from './GoalsPage'
import ExemptionReasonPage from '../induction/ExemptionPage'
import ConfirmExemptionRemovalPage from '../induction/ConfirmExemptionRemovalPage'

/**
 * Cypress page class representing the Overview tab of the Overview Page
 */
export default class OverviewPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Overview')
  }

  hasSuccessMessage(message: string): OverviewPage {
    this.successMessage() //
      .should('be.visible')
      .and('contain.text', message)
    return this
  }

  doesNotHaveSuccessMessage(): OverviewPage {
    this.successMessage().should('not.exist')
    return this
  }

  isForPrisoner(expected: string): OverviewPage {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  isPreInduction(): OverviewPage {
    this.preInductionOverviewPanel().should('be.visible')
    return this
  }

  isPostInduction(): OverviewPage {
    this.preInductionOverviewPanel().should('not.exist')
    return this
  }

  hasAddGoalButtonDisplayed(): OverviewPage {
    this.addGoalButton().should('be.visible')
    return this
  }

  doesNotHaveAddGoalButton(): OverviewPage {
    this.addGoalButton().should('not.exist')
    return this
  }

  clickAddGoalButton(): CreateGoalsPage {
    this.addGoalButton().click()
    return Page.verifyOnPage(CreateGoalsPage)
  }

  clickMakeProgressPlan(): HopingToWorkOnReleasePage {
    this.makeProgressPlanLink().click()
    return Page.verifyOnPage(HopingToWorkOnReleasePage)
  }

  activeTabIs(expected: string): OverviewPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  selectTab(targetTab: string): OverviewPage {
    cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`).click()
    return this
  }

  hasNumberOfInProgressGoals(numberOfGoals: number): OverviewPage {
    this.inProgressGoalsCount().contains(numberOfGoals)
    return this
  }

  hasNumberOfCompletedGoals(numberOfGoals: number): OverviewPage {
    this.completedGoalsCount().contains(numberOfGoals)
    return this
  }

  hasNumberOfArchivedGoals(numberOfGoals: number): OverviewPage {
    this.archivedGoalsCount().contains(numberOfGoals)
    return this
  }

  hasNumberOfActionPlanReviews(numberOfActionPlanReviews: number): OverviewPage {
    this.actionPlanReviewsCount().contains(numberOfActionPlanReviews)
    return this
  }

  hasLastUpdatedHint(expected: string): OverviewPage {
    this.goalLastUpdatedHint().should('contain.text', expected)
    return this
  }

  hasCuriousFunctionalSkillsUnavailableMessageDisplayed(): OverviewPage {
    this.curiousFunctionalSkillsUnavailableMessage().should('be.visible')
    return this
  }

  curiousFunctionalSkillsUnavailableMessageIsNotDisplayed(): OverviewPage {
    this.curiousFunctionalSkillsUnavailableMessage().should('not.exist')
    return this
  }

  hasServiceUnavailableMessageDisplayed(): OverviewPage {
    this.curiousFunctionalSkillsUnavailableMessage().should('not.exist')
    return this
  }

  printThisPageIsPresent(): OverviewPage {
    this.printThisPageLink().should('be.visible')
    return this
  }

  hasViewAllEducationAndTrainingButtonDisplayed(): OverviewPage {
    this.viewAllEducationAndTrainingButton().should('be.visible')
    return this
  }

  hasFunctionalSkillsTableDisplayed(): OverviewPage {
    this.functionalSkillsTable().should('be.visible')
    return this
  }

  hasNoFunctionalSkillsTableDisplayed(): OverviewPage {
    this.functionalSkillsTable().should('not.exist')
    return this
  }

  printThisPageIsNotPresent(): OverviewPage {
    this.printThisPageLink().should('not.exist')
    return this
  }

  clickToViewAllEducationAndTraining(): EducationAndTrainingPage {
    this.viewAllEducationAndTrainingButton().click()
    return Page.verifyOnPage(EducationAndTrainingPage)
  }

  clickViewArchivedGoalsButton(): GoalsPage {
    this.viewArchivedGoalsButton().click()
    return Page.verifyOnPage(GoalsPage)
  }

  clickViewInProgressGoalsButton(): GoalsPage {
    this.viewInProgressGoalsButton().click()
    return Page.verifyOnPage(GoalsPage)
  }

  clickViewCompletedGoalsButton(): GoalsPage {
    this.viewCompletedGoalsButton().click()
    return Page.verifyOnPage(GoalsPage)
  }

  actionsCardIsNotPresent(): OverviewPage {
    // Technically the action card as a HTML element is always present. If it contains no `li` elements then we use CSS to hide it
    // but because the runtime on CircleCI does not process/render the css we cannot use `.should('not.be.visible')`
    // Instead we will ensure there are zero `li` elements within it, and trust that the css hides the element in this case.
    this.actionsCard().should('exist')
    this.goalsActionItems().should('not.exist')
    this.reviewsActionItems().should('not.exist')
    return this
  }

  actionsCardContainsGoalsActions(): OverviewPage {
    this.actionsCard().should('exist')
    this.goalsActionItems().should('exist')
    return this
  }

  actionsCardContainsReviewsActions(): OverviewPage {
    this.actionsCard().should('exist')
    this.reviewsActionItems().should('exist')
    return this
  }

  actionsCardDoesNotContainReviewsActions(): OverviewPage {
    this.actionsCard().should('exist')
    this.reviewsActionItems().should('not.exist')
    return this
  }

  clickRecordInductionExemptionButton(): ExemptionReasonPage {
    this.inductionExemptionButton().click()
    return Page.verifyOnPage(ExemptionReasonPage)
  }

  clickRemoveInductionExemptionButton(): ConfirmExemptionRemovalPage {
    this.removeInductionExemptionButton().click()
    return Page.verifyOnPage(ConfirmExemptionRemovalPage)
  }

  inductionIsDue(): OverviewPage {
    this.inductionDueTag().should('exist')
    this.inductionExemptionButton().should('exist')
    this.removeInductionExemptionButton().should('not.exist')
    return this
  }

  inductionIsOnHold(): OverviewPage {
    this.inductionOnHoldTag().should('exist')
    this.inductionExemptionButton().should('not.exist')
    this.removeInductionExemptionButton().should('exist')
    return this
  }

  lrsVerifiedQualificationsCountIs = (expected: number): OverviewPage => {
    this.lrsVerifiedQualificationsCountUnavailableMessage().should('not.exist')
    this.lrsVerifiedQualificationsCount().should('have.text', expected)
    return this
  }

  lrsVerifiedQualificationsCountUnavailable = (): OverviewPage => {
    this.lrsVerifiedQualificationsCount().should('not.exist')
    this.lrsVerifiedQualificationsCountUnavailableMessage().should('be.visible')
    return this
  }

  lwpQualificationsCountIs = (expected: number): OverviewPage => {
    this.lwpQualificationsCountUnavailableMessage().should('not.exist')
    this.lwpQualificationsCount().should('have.text', expected)
    return this
  }

  lwpQualificationsCountUnavailable = (): OverviewPage => {
    this.lwpQualificationsCount().should('not.exist')
    this.lwpQualificationsCountUnavailableMessage().should('be.visible')
    return this
  }

  curiousInPrisonCourseCountIs = (expected: number): OverviewPage => {
    this.curiousInPrisonCourseCountUnavailableMessage().should('not.exist')
    this.curiousInPrisonCourseCount().should('have.text', expected)
    return this
  }

  curiousInPrisonCourseCountUnavailable = (): OverviewPage => {
    this.curiousInPrisonCourseCount().should('not.exist')
    this.curiousInPrisonCourseCountUnavailableMessage().should('be.visible')
    return this
  }

  educationAndTrainingSummaryCardApiErrorBannerIsDisplayed = (): OverviewPage => {
    this.educationAndTrainingSummaryCardApiErrorBanner().should('be.visible')
    return this
  }

  educationAndTrainingSummaryCardApiErrorBannerIsNotDisplayed = (): OverviewPage => {
    this.educationAndTrainingSummaryCardApiErrorBanner().should('not.exist')
    return this
  }

  private lrsVerifiedQualificationsCount = (): PageElement => cy.get('[data-qa=lrs-verified-qualifications-count')

  private lrsVerifiedQualificationsCountUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=lrs-verified-qualifications-unavailable-message')

  private lwpQualificationsCount = (): PageElement => cy.get('[data-qa=lwp-qualifications-count')

  private lwpQualificationsCountUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=lwp-qualifications-unavailable-message')

  private curiousInPrisonCourseCount = (): PageElement => cy.get('[data-qa=curious-in-prison-courses-count')

  private curiousInPrisonCourseCountUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=curious-in-prison-courses-unavailable-message')

  private educationAndTrainingSummaryCardApiErrorBanner = (): PageElement =>
    cy.get('[data-qa=education-and-training-summary-card-api-error-banner]')

  private prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  private inProgressGoalsCount = (): PageElement => cy.get('[data-qa=in-progress-goals-count]')

  private completedGoalsCount = (): PageElement => cy.get('[data-qa=completed-goals-count]')

  private archivedGoalsCount = (): PageElement => cy.get('[data-qa=archived-goals-count]')

  private actionPlanReviewsCount = (): PageElement => cy.get('[data-qa=action-plan-reviews-count]')

  private viewInProgressGoalsButton = (): PageElement => cy.get('[data-qa=view-in-progress-goals-button]')

  private viewCompletedGoalsButton = (): PageElement => cy.get('[data-qa=view-completed-goals-button]')

  private viewArchivedGoalsButton = (): PageElement => cy.get('[data-qa=view-archived-goals-button]')

  private goalLastUpdatedHint = (): PageElement => cy.get('[data-qa=goal-last-updated-hint]')

  private functionalSkillsTable = (): PageElement => cy.get('[data-qa=functional-skills-table]')

  private curiousFunctionalSkillsUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=functional-skills-unavailable-message]')

  private actionPlanReviewsDataUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=action-plan-reviews-data-unavailable-message]')

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private addGoalButton = (): PageElement => cy.get('[data-qa=add-goal-button]')

  private viewAllEducationAndTrainingButton = (): PageElement =>
    cy.get('[data-qa=view-education-and-training-tab-button]')

  private preInductionOverviewPanel = (): PageElement => cy.get('[data-qa=pre-induction-overview]')

  private makeProgressPlanLink = (): PageElement =>
    cy.get('[data-qa=pre-induction-overview] a.govuk-notification-banner__link')

  private printThisPageLink = (): PageElement => cy.get('#print-link')

  private successMessage = (): PageElement => cy.get('[data-qa=overview-success-message]')

  private actionsCard = (): PageElement => cy.get('[data-qa=actions-card]')

  private goalsActionItems = (): PageElement => cy.get('[data-qa=goals-action-items] li')

  private reviewsActionItems = (): PageElement => cy.get('[data-qa=reviews-action-items] li')

  private inductionActionItems = (): PageElement => cy.get('[data-qa=induction-action-items] li')

  private inductionExemptionButton = (): PageElement =>
    this.inductionActionItems().find('[data-qa=record-exemption-button]')

  private removeInductionExemptionButton = (): PageElement =>
    this.inductionActionItems().find('[data-qa=remove-exemption-button]')

  private inductionOnHoldTag = (): PageElement => cy.get('[data-qa=induction-on-hold]')

  private inductionNotDueTag = (): PageElement => cy.get('[data-qa=induction-not-due]')

  private goalsNotDueTag = (): PageElement => cy.get('[data-qa=goals-not-due]')

  private inductionDueTag = (): PageElement => cy.get('[data-qa=induction-due]')

  private goalsDueTag = (): PageElement => cy.get('[data-qa=goals-due]')

  private inductionOverdueTag = (): PageElement => cy.get('[data-qa=induction-overdue]')

  private goalsOverdueTag = (): PageElement => cy.get('[data-qa=goals-overdue]')
}
