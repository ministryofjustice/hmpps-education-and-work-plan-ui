import Page, { PageElement } from '../page'

export default class PrisonerListPage extends Page {
  constructor() {
    super('prisoner-list-page')
  }

  hasResultsDisplayed(expectedResultCount: number): PrisonerListPage {
    this.prisonerListResultsTable().should('be.visible')
    this.zeroResultsMessage().should('not.exist')
    this.paginationResultsCount().should('contain', ` of ${expectedResultCount} results`)
    return this
  }

  hasNoResultsDisplayed(): PrisonerListPage {
    this.zeroResultsMessage().should('be.visible')
    this.prisonerListResultsTable().should('not.exist')
    return this
  }

  hasNoSearchTerm(): PrisonerListPage {
    this.searchTermField().should('be.empty')
    return this
  }

  hasSearchTerm(expected: string): PrisonerListPage {
    this.searchTermField().should('have.value', expected)
    return this
  }

  hasNoStatusFilter(): PrisonerListPage {
    this.statusFilterDropdown().find('option:selected').should('have.value', '')
    return this
  }

  setNameFilter(value: string): PrisonerListPage {
    this.searchTermField().clear().type(value)
    return this
  }

  setStatusFilter(value: string): PrisonerListPage {
    this.statusFilterDropdown().select(value)
    return this
  }

  applyFilters(): PrisonerListPage {
    this.applyFiltersButton().click()
    return this
  }

  clearFilters(): PrisonerListPage {
    this.clearFiltersButton().click()
    return this
  }

  sortBy(field: 'name' | 'location' | 'release-date' | 'reception-date' | 'status'): PrisonerListPage {
    this.sortableTableHeaders().find(`[data-qa=${field}-column-header] button`).click()
    return this
  }

  isSortedBy(
    field: 'name' | 'location' | 'release-date' | 'reception-date' | 'status',
    direction: 'ascending' | 'descending',
  ): PrisonerListPage {
    this.sortableTableHeaders().find(`[data-qa=${field}-column-header]`).should('have.attr', 'aria-sort', direction)
    return this
  }

  firstRowNameIs(expected: string): PrisonerListPage {
    this.prisonerListResultsFirstRow().find('td:nth-of-type(1) a').should('contain', expected)
    return this
  }

  firstRowPrisonNumberIs(expected: string): PrisonerListPage {
    this.prisonerListResultsFirstRow().find('td:nth-of-type(1) span').should('contain', expected)
    return this
  }

  firstRowLocationIs(expected: string): PrisonerListPage {
    this.prisonerListResultsFirstRow().find('td:nth-of-type(2)').should('contain', expected)
    return this
  }

  gotoPage(value: number): PrisonerListPage {
    this.paginationControls().find(`li:nth-of-type(${value}) a`).click()
    return this
  }

  paginationCurrentPageIs(value: number): PrisonerListPage {
    this.paginationControls().find(`li:nth-of-type(${value})`).should('have.attr', 'aria-current', 'page')
    return this
  }

  hasPreviousLinkDisplayed(): PrisonerListPage {
    this.paginationFirstLink().should('contain', 'Previous')
    return this
  }

  hasNextLinkDisplayed(): PrisonerListPage {
    this.paginationLastLink().should('contain', 'Next')
    return this
  }

  hasPaginationLinkForPage(page: number): PrisonerListPage {
    this.paginationControls().find(`li:nth-of-type(${page}) a`).should('contain', `${page}`)
    return this
  }

  searchTermField = (): PageElement => cy.get('#searchTerm')

  statusFilterDropdown = (): PageElement => cy.get('#statusFilter')

  applyFiltersButton = (): PageElement => cy.get('[data-qa=apply-filters]')

  clearFiltersButton = (): PageElement => cy.get('[data-qa=clear-filters]')

  prisonerListResultsTable = (): PageElement => cy.get('[data-qa=prisoner-list-results-table]')

  prisonerListResultsFirstRow = (): PageElement =>
    cy.get('[data-qa=prisoner-list-results-table] tbody tr:first-of-type')

  zeroResultsMessage = (): PageElement => cy.get('[data-qa=zero-results-message]')

  paginationControls = (): PageElement => cy.get('[data-qa=prisoner-list-pagination] ul')

  paginationResultsCount = (): PageElement => cy.get('[data-qa=prisoner-list-pagination] p')

  paginationFirstLink = (): PageElement => cy.get('[data-qa=prisoner-list-pagination] ul li:first-of-type a')

  paginationLastLink = (): PageElement => cy.get('[data-qa=prisoner-list-pagination] ul li:last-of-type a')

  sortableTableHeaders = (): PageElement => cy.get('[data-qa=sortable-table-headers]')
}
