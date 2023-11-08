import type { PrisonerSearchSummary } from 'viewModels'
import Page from '../../pages/page'
import PrisonerListPage from '../../pages/prisonerList/PrisonerListPage'

/**
 * Cypress scenarios for the Prisoner List page.
 *
 * These scenarios are for the Prisoner List page only and make use of large numbers of randomly generated prisoner data,
 * suitable for asserting the functionality of the Prisoner List page itself (such as paging, filtering and sorting).
 *
 * Scenarios that need to click "into" a specific prisoner record to get to the Overview page will need some extra stubbing
 * in order to set specific stubs in the Action Plan API for the specific prisoner clicked on.
 */
context(`Display the prisoner list screen`, () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisonerSearchSummaries: Array<PrisonerSearchSummary>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')

    // Generate 725 Prisoner Search Summaries that will be displayed on the Prisoner List page by virtue of using them in the prisoner-search, CIAG, and Action Plan stubs
    // 725 is a very specific number and is used because it will mean we have 15 pages (14 pages of 50, plus 1 of 25)
    // This means we can assert elements of the paging such as Previous, Next, the number of page links, the "sliding window of 10" page links etc
    cy.task('generatePrisonerSearchSummaries', 725).then(summaries => {
      prisonerSearchSummaries = summaries as Array<PrisonerSearchSummary>
      cy.task('stubPrisonerListFromPrisonerSearchSummaries', summaries)
      cy.task('stubCiagInductionListFromPrisonerSearchSummaries', summaries)
      cy.task('stubActionPlansListFromPrisonerSearchSummaries', summaries)
    })
  })

  it('should be able to navigate directly to the prisoner list page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
    prisonerListPage.hasResultsDisplayed()
  })

  it('should search for non existent prisoner and get zero results', () => {
    // Given
    cy.signIn()
    cy.visit('/')
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

    // When
    prisonerListPage //
      .setNameFilter('some non existent search term')
      .applyFilters()

    // Then
    prisonerListPage.hasNoResultsDisplayed()
  })

  it('should clear filters to reset the search', () => {
    // Given
    cy.signIn()
    cy.visit('/')
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
    prisonerListPage //
      .setNameFilter('some non existent search term')
      .setStatusFilter('NEEDS_PLAN')
      .applyFilters()
      .hasNoResultsDisplayed()

    // When
    prisonerListPage.clearFilters()

    // Then
    prisonerListPage //
      .hasResultsDisplayed()
      .hasNoSearchTerm()
      .hasNoStatusFilter()
  })
})
