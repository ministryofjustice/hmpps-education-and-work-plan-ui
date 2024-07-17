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
    this.goalSummaryCards().eq(position).should('contain.text', expectedText)
    return this
  }

  clickReactivateButtonForFirstGoal(): UnarchiveGoalPage {
    this.goalReactivateButton(1).click()
    return Page.verifyOnPage(UnarchiveGoalPage)
  }

  private goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  private goalReactivateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-unarchive-button]`)
}
