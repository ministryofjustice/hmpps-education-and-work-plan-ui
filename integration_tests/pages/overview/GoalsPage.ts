import Page, { PageElement } from '../page'
import UnarchiveGoalPage from '../goal/UnarchiveGoalPage'
import UpdateGoalPage from '../goal/UpdateGoalPage'
import CompleteOrArchiveGoalPage from '../goal/CompleteOrArchiveGoalPage'

/**
 * Cypress page class representing the "View Goals" page
 */
export default class GoalsPage extends Page {
  constructor() {
    super('view-goals')
    this.activeTabIs('Goals')
  }

  activeTabIs(expected: string): GoalsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasNumberOfArchivedGoals(numberOfGoals: number): GoalsPage {
    this.archivedGoalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  hasNumberOfInProgressGoals(numberOfGoals: number): GoalsPage {
    this.inProgressGoalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  hasNumberOfCompletedGoals(numberOfGoals: number): GoalsPage {
    this.completedGoalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  hasArchivedGoalsDisplayed(): GoalsPage {
    this.archivedGoalSummaryCards().should('exist')
    return this
  }

  hasInProgressGoalsDisplayed(): GoalsPage {
    this.inProgressGoalSummaryCards().should('exist')
    return this
  }

  hasCompletedGoalsDisplayed(): GoalsPage {
    this.completedGoalSummaryCards().should('exist')
    return this
  }

  archivedGoalSummaryCardAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.archivedGoalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  inProgressGoalSummaryCardAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.inProgressGoalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  completedGoalSummaryCardAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.completedGoalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  goalLastUpdatedHintTextAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.inProgressGoalHintText().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  goalArchivedHintTextAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.archivedGoalHintText().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  goalArchivedReasonAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.archiveReason().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  goalCompletedHintTextAtPositionContains(position: number, expectedText: string): GoalsPage {
    this.completedGoalHintText().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  clickReactivateButtonForGoal(expectedText: string, position: number): UnarchiveGoalPage {
    this.goalReactivateButton(expectedText).eq(this.zeroIndexed(position)).click()
    return Page.verifyOnPage(UnarchiveGoalPage)
  }

  noArchivedGoalsMessageShouldNotBeVisible(): GoalsPage {
    this.noArchivedGoalsMessage().should('not.exist')
    return this
  }

  noArchivedGoalsMessageShouldBeVisible(): GoalsPage {
    this.noArchivedGoalsMessage().should('exist')
    return this
  }

  clickCompleteOrArchiveButtonForGoal(goalReference: string): CompleteOrArchiveGoalPage {
    this.goalCompleteOrArchiveButton(goalReference).click()
    return Page.verifyOnPage(CompleteOrArchiveGoalPage)
  }

  checkOnArchivedGoalsTab(): GoalsPage {
    cy.url().should('include', 'archived-goals')
    return this
  }

  checkOnInProgressGoalsTab(): GoalsPage {
    cy.url().should('include', 'in-progress-goals')
    return this
  }

  checkOnCompletedGoalsTab(): GoalsPage {
    cy.url().should('include', 'completed-goals')
    return this
  }

  clickInProgressGoalsTab = (): GoalsPage => {
    this.inProgressGoalsTab().click()
    return this
  }

  clickArchivedGoalsTab = (): GoalsPage => {
    this.archivedGoalsTab().click()
    return this
  }

  clickCompletedGoalsTab = (): GoalsPage => {
    this.completedGoalsTab().click()
    return this
  }

  isForGoal(expected: string) {
    this.goalReferenceInputValue().should('have.value', expected)
    return this
  }

  clickUpdateButtonForGoal(goalReference: string): UpdateGoalPage {
    this.goalUpdateButton(goalReference).click()
    return Page.verifyOnPage(UpdateGoalPage)
  }

  private goalUpdateButton = (goalReference: string): PageElement =>
    cy.get(`[data-qa=goal-${goalReference}-update-button]`)

  private goalReferenceInputValue = (): PageElement => cy.get('[data-qa=goal-reference]')

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private inProgressGoalsTab = (): PageElement => cy.get('.govuk-tabs__tab[href="#in-progress-goals"]')

  private archivedGoalsTab = (): PageElement => cy.get('.govuk-tabs__tab[href="#archived-goals"]')

  private completedGoalsTab = (): PageElement => cy.get('.govuk-tabs__tab[href="#completed-goals"]')

  private archivedGoalSummaryCards = (): PageElement => cy.get('[data-qa=archived-goal-summary-card]')

  private inProgressGoalSummaryCards = (): PageElement => cy.get('[data-qa=in-progress-goal-summary-card]')

  private completedGoalSummaryCards = (): PageElement => cy.get('[data-qa=completed-goal-summary-card]')

  private inProgressGoalHintText = (): PageElement => cy.get('[data-qa=goal-last-updated-hint]')

  private completedGoalHintText = (): PageElement => cy.get('[data-qa=goal-completed-hint]')

  private archivedGoalHintText = (): PageElement => cy.get('[data-qa=goal-archived-hint]')

  private archiveReason = (): PageElement => cy.get('[data-qa=goal-archive-reason]')

  private goalReactivateButton = (goalReference: string): PageElement =>
    cy.get(`[data-qa=goal-${goalReference}-unarchive-button]`)

  private goalCompleteOrArchiveButton = (goalReference: string): PageElement =>
    cy.get(`[data-qa=goal-${goalReference}-completearchive-button]`)

  private noArchivedGoalsMessage = (): PageElement => cy.get('[data-qa=no-archived-goals-message]')
}
