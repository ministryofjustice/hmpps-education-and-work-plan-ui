import type { PrisonerSearchSummary } from 'viewModels'
import Page from '../../pages/page'
import PrisonerListPage from '../../pages/prisonerList/PrisonerListPage'
import Error500Page from '../../pages/error500'

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
  let prisonerSearchSummaries: Array<PrisonerSearchSummary>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')

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
    const expectedResultCount = prisonerSearchSummaries.length

    // When
    cy.visit('/')

    // Then
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
    prisonerListPage.hasResultsDisplayed(expectedResultCount)
  })
  ;['VIEW', 'CONTRIBUTOR'].forEach(authority => {
    it(`users with authority ${authority} should get the prisoner list page as their landing page straight after login`, () => {
      // Given
      if (authority === 'VIEW') {
        cy.task('stubSignInAsReadOnlyUser')
      } else if (authority === 'CONTRIBUTOR') {
        cy.task('stubSignInAsUserWithContributorRole')
      }
      const expectedResultCount = prisonerSearchSummaries.length

      // When
      cy.signIn()

      // Then
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
      prisonerListPage.hasResultsDisplayed(expectedResultCount)
    })
  })

  it('should display service unavailable message given prisoner-search API returns a 500', () => {
    // Given
    cy.signIn()
    cy.task('stubPrisonerList500error')

    // When
    cy.visit('/', { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })

  it('should display service unavailable message given CIAG API returns a 500', () => {
    // Given
    cy.signIn()
    cy.task('stubCiagInductionList500error')

    // When
    cy.visit('/', { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })

  it('should display service unavailable message given Action Plans API returns a 500', () => {
    // Given
    cy.signIn()
    cy.task('stubActionPlansList500error')

    // When
    cy.visit('/', { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })

  describe('filtering', () => {
    it('should filter for non existent prisoner and get zero results', () => {
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

    it('should filter for prisoners named John', () => {
      // Given
      cy.signIn()
      cy.visit('/')
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

      const numberOfPrisonersNamedJohn = prisonerSearchSummaries.filter(
        prisonerSearchSummary =>
          prisonerSearchSummary.firstName.includes('JOHN') || prisonerSearchSummary.lastName.includes('JOHN'),
      ).length

      // When
      prisonerListPage //
        .setNameFilter('John')
        .applyFilters()

      // Then
      prisonerListPage //
        .hasResultsDisplayed(numberOfPrisonersNamedJohn)
    })
    ;['VIEW', 'CONTRIBUTOR', 'MANAGER'].forEach(authority => {
      it(`users with authority ${authority} should be able to clear filters to reset the search and be left on the prisoner list page with no active filters set`, () => {
        // Given
        if (authority === 'VIEW') {
          cy.task('stubSignInAsReadOnlyUser')
        } else if (authority === 'MANAGER') {
          cy.task('stubSignInAsUserWithManagerRole')
        } else if (authority === 'CONTRIBUTOR') {
          cy.task('stubSignInAsUserWithContributorRole')
        }
        cy.signIn()
        cy.visit(authority === 'MANAGER' ? '/search' : '/') // prisoner-list route is '/' for read only or contributors; but is '/search' for managers

        const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
        prisonerListPage //
          .setNameFilter('some non existent search term')
          .setStatusFilter('NEEDS_PLAN')
          .applyFilters()
          .hasNoResultsDisplayed()

        const expectedResultCount = prisonerSearchSummaries.length

        // When
        prisonerListPage.clearFilters()

        // Then
        Page.verifyOnPage(PrisonerListPage)
        prisonerListPage //
          .hasResultsDisplayed(expectedResultCount)
          .hasNoSearchTerm()
          .hasNoStatusFilter()
      })
    })
  })

  describe('sorting', () => {
    it('should be sorted by reception-date descending as the default sort order', () => {
      // Given
      cy.signIn()
      cy.visit('/')

      // When
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

      // Then
      prisonerListPage //
        .isSortedBy('reception-date', 'descending')
    })

    it('should sort by location descending', () => {
      // Given
      cy.signIn()
      cy.visit('/')
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

      const expectedFirstRowInTable = prisonerSearchSummaries
        .map(summary => ({ ...summary }))
        .sort((left: PrisonerSearchSummary, right: PrisonerSearchSummary): number => {
          if (left.location === right.location) {
            return 0
          }
          return left.location > right.location ? -1 : 1
        })[0]

      // When
      prisonerListPage.sortBy('location').sortBy('location') // Need to click twice as the first click sorts ascending; 2nd click sorts descending

      // Then
      prisonerListPage //
        .isSortedBy('location', 'descending')
        .firstRowNameIs(
          `${capitalize(expectedFirstRowInTable.lastName)}, ${capitalize(expectedFirstRowInTable.firstName)}`,
        )
        .firstRowPrisonNumberIs(expectedFirstRowInTable.prisonNumber)
        .firstRowLocationIs(expectedFirstRowInTable.location)
    })
  })

  describe('pagination', () => {
    it('should display pagination controls, displaying 1 to 10 with the next link, on the first page of the prisoner list', () => {
      // Given
      cy.signIn()
      cy.visit('/')

      // When
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

      // Then
      prisonerListPage //
        .paginationCurrentPageIs(1)
        .hasPaginationLinkForPage(2)
        .hasPaginationLinkForPage(3)
        .hasPaginationLinkForPage(4)
        .hasPaginationLinkForPage(5)
        .hasPaginationLinkForPage(6)
        .hasPaginationLinkForPage(8)
        .hasPaginationLinkForPage(9)
        .hasPaginationLinkForPage(10)
        .hasNextLinkDisplayed()
    })

    it('should display pagination controls, displaying 2 to 11 with the next and previous links, on the 7th page of the prisoner list', () => {
      // Given
      cy.signIn()
      cy.visit('/')
      const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

      // When
      prisonerListPage.gotoPage(7)

      // Then
      prisonerListPage //
        .hasPreviousLinkDisplayed()
        .hasPaginationLinkForPage(2)
        .hasPaginationLinkForPage(3)
        .hasPaginationLinkForPage(4)
        .hasPaginationLinkForPage(5)
        .hasPaginationLinkForPage(6)
        .paginationCurrentPageIs(7)
        .hasPaginationLinkForPage(8)
        .hasPaginationLinkForPage(9)
        .hasPaginationLinkForPage(10)
        .hasPaginationLinkForPage(11)
        .hasNextLinkDisplayed()
    })
  })
})

const capitalize = (name: string): string => {
  const trimmedLowercaseName = name.trim().toLowerCase()
  return trimmedLowercaseName.charAt(0).toUpperCase() + trimmedLowercaseName.slice(1)
}
