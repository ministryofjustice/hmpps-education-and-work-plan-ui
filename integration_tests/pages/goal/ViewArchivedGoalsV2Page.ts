import Page, { PageElement } from '../page'
import UnarchiveGoalPage from './UnarchiveGoalPage'

/**
 * Cypress page class representing the "View Archived Goals" page
 */
export default class ViewArchivedGoalsV2Page extends Page {
  constructor() {
    super('view-archived-goals-v2')
  }

  hasNumberOfGoals(numberOfGoals: number): ViewArchivedGoalsV2Page {
    this.goalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  goalSummaryCardAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsV2Page {
    this.goalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  lastUpdatedHintAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsV2Page {
    this.lastUpdatedHint().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  archiveReasonHintAtPositionContains(position: number, expectedText: string): ViewArchivedGoalsV2Page {
    this.archiveReasonHint().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  clickReactivateButtonForFirstGoal(): UnarchiveGoalPage {
    this.goalReactivateButton(1).click()
    return Page.verifyOnPage(UnarchiveGoalPage)
  }

  noArchivedGoalsMessageShouldNotBeVisible(): ViewArchivedGoalsV2Page {
    this.noArchivedGoalsMessage().should('not.exist')
    return this
  }

  noArchivedGoalsMessageShouldBeVisible(): ViewArchivedGoalsV2Page {
    this.noArchivedGoalsMessage().should('exist')
    return this
  }

  selectSubTab(targetTab: string): ViewArchivedGoalsV2Page {
    cy.get(`.govuk-tabs__tab:contains('${targetTab}')`).click()
    return this
  }

  hasServiceUnavailableMessageDisplayed(): ViewArchivedGoalsV2Page {
    this.errorRetrievingGoalsMessage().contains('Sorry, the service is currently unavailable.')
    return this
  }

  private goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  private lastUpdatedHint = (): PageElement => cy.get('[data-qa=goal-last-updated-hint]')

  private archiveReasonHint = (): PageElement => cy.get('[data-qa=goal-archive-reason-hint]')

  private goalReactivateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-unarchive-button]`)

  private noArchivedGoalsMessage = (): PageElement => cy.get('[data-qa=no-archived-goals-message]')

  private errorRetrievingGoalsMessage = (): PageElement => cy.get('[data-qa=problem-retrieving-goals-message]')
}
