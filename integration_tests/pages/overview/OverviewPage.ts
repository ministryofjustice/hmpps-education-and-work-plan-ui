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

  hasCourseCompletedInLast12Months = (expectedCourseName: string): OverviewPage => {
    this.courseName(expectedCourseName).should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageDisplayed(): OverviewPage {
    this.curiousUnavailableMessage().contains('We cannot show these details from Curious right now')
    return this
  }

  hasNoCuriousUnavailableMessageDisplayed(): OverviewPage {
    this.curiousUnavailableMessage().should('not.exist')
    return this
  }

  hasServiceUnavailableMessageDisplayed(): OverviewPage {
    this.curiousUnavailableMessage().should('not.exist')
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

  hasNoCoursesCompletedInLast12MonthsMessageDisplayed(): OverviewPage {
    this.noCoursesCompletedInLast12MonthsMessage().should('be.visible')
    return this
  }

  hasNoCoursesCompletedYetMessageDisplayed(): OverviewPage {
    this.noCoursesCompletedYetMessage().should('be.visible')
    return this
  }

  hasNoCoursesRecordedMessageDisplayed(): OverviewPage {
    this.noCoursesRecordedMessage().should('be.visible')
    return this
  }

  hasNoCoursesTableDisplayed(): OverviewPage {
    this.completedCoursesinLast12MonthsTable().should('not.exist')
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

  private completedCoursesinLast12MonthsTable = (): PageElement =>
    cy.get('[data-qa=completed-in-prison-courses-in-last-12-months-table]')

  private noCoursesCompletedInLast12MonthsMessage = (): PageElement =>
    cy.get('[data-qa=no-courses-completed-in-last-12-months-message]')

  private noCoursesCompletedYetMessage = (): PageElement => cy.get('[data-qa=no-courses-completed-yet-message]')

  private noCoursesRecordedMessage = (): PageElement => cy.get('[data-qa=no-courses-recorded-message]')

  private curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')

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

  private courseName = (expectedCourseName: string): PageElement =>
    this.completedCoursesinLast12MonthsTable().find(`[data-qa=completed-course-name]:contains(${expectedCourseName})`)

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
