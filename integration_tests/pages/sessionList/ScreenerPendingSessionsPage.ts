import Page, { PageElement } from '../page'

export default class ScreenerPendingSessionsPage extends Page {
  constructor() {
    super('screener-pending-sessions-list-page')
  }

  hasColumnHeaders(expected: Array<string>): ScreenerPendingSessionsPage {
    this.columnHeaders().should('have.length', expected.length)
    expected.forEach((columnHeader, idx) => {
      this.columnHeaders().eq(idx).should('have.attr', 'data-qa', `${columnHeader}-column-header`)
    })
    return this
  }

  hasResultsDisplayed(expected: number): ScreenerPendingSessionsPage {
    this.resultsRows().should('have.length', expected)
    return this
  }

  setNameOrPrisonNumberFilter(value: string): ScreenerPendingSessionsPage {
    this.searchTermField().clear().type(value, { delay: 0 })
    return this
  }

  applyFilters(): ScreenerPendingSessionsPage {
    this.applyFiltersButton().click()
    return this
  }

  sortBy(columnName: string): ScreenerPendingSessionsPage {
    this.columnHeaderButton(columnName).click()
    return this
  }

  isSortedBy(columnName: string, direction: 'ascending' | 'descending'): ScreenerPendingSessionsPage {
    this.columnHeader(columnName).should('have.attr', 'aria-sort', direction)
    return this
  }

  /*
   * Asserts the "Filter by session type" radio group is absent. The results table form still carries a
   * hidden sessionType field (it preserves search options across a sort), so this deliberately looks for
   * the radio inputs rather than any element named sessionType.
   */
  hasNoSessionTypeFilter(): ScreenerPendingSessionsPage {
    cy.get('input[type=radio][name=sessionType]').should('not.exist')
    return this
  }

  private columnHeaders = (): PageElement => cy.get('[data-qa=sortable-table-headers] th')

  private columnHeader = (columnName: string): PageElement => cy.get(`[data-qa=${columnName}-column-header]`)

  private columnHeaderButton = (columnName: string): PageElement =>
    cy.get(`[data-qa=${columnName}-column-header] button`)

  private resultsRows = (): PageElement => cy.get('[data-qa=session-list-results-table] tbody tr')

  private searchTermField = (): PageElement => cy.get('#searchTerm')

  private applyFiltersButton = (): PageElement => cy.get('[data-qa=submit-button]')
}
