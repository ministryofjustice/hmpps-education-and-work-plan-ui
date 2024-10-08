import Page, { PageElement } from '../page'
import UnarchiveGoalPage from './UnarchiveGoalPage'

/**
 * Cypress page class representing the "View Archived Goals" page
 */
export default class ViewArchivedGoalsPage extends Page {
  constructor() {
    super('view-archived-goals')
  }

  hasNumberOfGoals(numberOfGoals: number): ViewArchivedGoalsPage {
    this.goalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  goalSummaryCardAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsPage {
    this.goalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  lastUpdatedHintAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsPage {
    this.lastUpdatedHint().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  archiveReasonHintAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsPage {
    this.archiveReasonHint().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  clickReactivateButtonForFirstGoal(): UnarchiveGoalPage {
    this.goalReactivateButton(1).click()
    return Page.verifyOnPage(UnarchiveGoalPage)
  }

  noArchivedGoalsMessageShouldNotBeVisible(): ViewArchivedGoalsPage {
    this.noArchivedGoalsMessage().should('not.exist')
    return this
  }

  noArchivedGoalsMessageShouldBeVisible(): ViewArchivedGoalsPage {
    this.noArchivedGoalsMessage().should('exist')
    return this
  }

  private goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  private lastUpdatedHint = (): PageElement => cy.get('[data-qa=goal-last-updated-hint]')

  private archiveReasonHint = (): PageElement => cy.get('[data-qa=goal-archive-reason-hint]')

  private goalReactivateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-unarchive-button]`)

  private noArchivedGoalsMessage = (): PageElement => cy.get('[data-qa=no-archived-goals-message]')
}
