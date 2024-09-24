import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the "View Archived Goals" page
 */
export default class ViewInProgressGoalsPage extends Page {
  constructor() {
    super('view-in-progress-goals')
  }

  hasNumberOfGoals(numberOfGoals: number): ViewInProgressGoalsPage {
    this.goalSummaryCards().should('have.length', numberOfGoals)
    return this
  }

  goalSummaryCardAtPositionContains(position: number, expectedText: string): ViewInProgressGoalsPage {
    this.goalSummaryCards().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  lastUpdatedHintAtPositionContains(position: number, expectedText: string): ViewInProgressGoalsPage {
    this.lastUpdatedHint().eq(this.zeroIndexed(position)).should('contain.text', expectedText)
    return this
  }

  clickUpdateButtonForFirstGoal(): ViewInProgressGoalsPage {
    this.goalUpdateButton(1).click()
    return Page.verifyOnPage(ViewInProgressGoalsPage)
  }

  clickArchiveButtonForFirstGoal(): ViewInProgressGoalsPage {
    this.goalArchiveButton(1).click()
    return Page.verifyOnPage(ViewInProgressGoalsPage)
  }

  noInProgressGoalsMessageShouldNotBeVisible(): ViewInProgressGoalsPage {
    this.noInProgressGoalsMessage().should('not.exist')
    return this
  }

  noInProgressGoalsMessageShouldBeVisible(): ViewInProgressGoalsPage {
    this.noInProgressGoalsMessage().should('exist')
    return this
  }

  clickArchivedGoalTab() {
    this.archivedGoalsTab().click()
  }

  hasServiceUnavailableMessageDisplayed(): ViewInProgressGoalsPage {
    this.errorRetrievingGoalsMessage().contains('Sorry, the service is currently unavailable.')
    return this
  }

  private goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  private lastUpdatedHint = (): PageElement => cy.get('[data-qa=goal-last-updated-hint]')

  private goalUpdateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-update-button]`)

  private goalArchiveButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-archive-button]`)

  private noInProgressGoalsMessage = (): PageElement => cy.get('[data-qa=no-in-progress-goals-message]')

  private archivedGoalsTab = (): PageElement => cy.get('[data-qa=archived-tab-link]')

  private errorRetrievingGoalsMessage = (): PageElement => cy.get('[data-qa=problem-retrieving-goals-message]')
}
