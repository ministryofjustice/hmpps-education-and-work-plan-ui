import Page, { PageElement } from '../page'

export default class PrisonerListPage extends Page {
  constructor() {
    super('prisoner-list-page')
  }

  hasResultsDisplayed(): PrisonerListPage {
    this.prisonerListResultsTable().should('be.visible')
    this.zeroResultsMessage().should('not.exist')
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

  searchTermField = (): PageElement => cy.get('#searchTerm')

  statusFilterDropdown = (): PageElement => cy.get('#statusFilter')

  applyFiltersButton = (): PageElement => cy.get('[data-qa=apply-filters]')

  clearFiltersButton = (): PageElement => cy.get('[data-qa=clear-filters]')

  prisonerListResultsTable = (): PageElement => cy.get('[data-qa=prisoner-list-results-table]')

  zeroResultsMessage = (): PageElement => cy.get('[data-qa=zero-results-message]')
}
