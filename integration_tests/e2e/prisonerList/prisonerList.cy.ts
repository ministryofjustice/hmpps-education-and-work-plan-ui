import type { PersonResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import PrisonerListPage from '../../pages/prisonerList/PrisonerListPage'
import SearchSortField from '../../../server/enums/searchSortField'
import OverviewPage from '../../pages/overview/OverviewPage'

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
  let peopleGroupedByPageRequest: Array<Array<PersonResponse>>

  const processGeneratedPeopleIntoPagedApiResponses = (people: Array<PersonResponse>) => {
    peopleGroupedByPageRequest = new Array(15)
    for (let i = 0; i < 15; i += 1) {
      peopleGroupedByPageRequest[i] = people.slice(i * 50, (i + 1) * 50)
    }
    peopleGroupedByPageRequest.forEach((pageOfPeople, idx) => {
      cy.task('stubSearchByPrison', {
        page: idx + 1,
        pageOfPrisoners: pageOfPeople,
        totalRecords: 725,
        sortBy: SearchSortField.ENTERED_PRISON_DATE,
      })
    })
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')

    // Generate 725 PersonResponse records that will be displayed on the Prisoner List page by virtue of using them in the search API stub.
    // 725 is a very specific number and is used because it will mean we have 15 pages (14 pages of 50, plus 1 of 25)
    // This means we can assert elements of the paging such as Previous, Next, the number of page links, the "sliding window of 10" page links etc
    cy.task('generatePeople', 725).then(processGeneratedPeopleIntoPagedApiResponses)
  })

  it('should be able to navigate directly to the prisoner list page', () => {
    // Given
    cy.signIn()
    const expectedResultCount = 725

    // When
    cy.visit('/')

    // Then
    Page.verifyOnPage(PrisonerListPage) //
      .apiErrorBannerIsNotDisplayed()
      .hasResultsDisplayed(expectedResultCount)
      .searchUnavailableMessageIsNotDisplayed()
  })
  ;['VIEW', 'CONTRIBUTOR'].forEach(authority => {
    it(`users with authority ${authority} should get the prisoner list page as their landing page straight after login`, () => {
      // Given
      if (authority === 'VIEW') {
        cy.task('stubSignInAsReadOnlyUser')
      } else if (authority === 'CONTRIBUTOR') {
        cy.task('stubSignInAsUserWithContributorRole')
      }
      cy.task('generatePeople', 725).then(processGeneratedPeopleIntoPagedApiResponses)
      const expectedResultCount = 725

      // When
      cy.signIn()

      // Then
      Page.verifyOnPage(PrisonerListPage) //
        .apiErrorBannerIsNotDisplayed()
        .hasResultsDisplayed(expectedResultCount)
        .searchUnavailableMessageIsNotDisplayed()
    })
  })

  it('should display service unavailable message given search API returns a 500', () => {
    // Given
    cy.signIn()
    cy.task('stubSearchByPrison500Error')

    // When
    cy.visit('/', { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(PrisonerListPage) //
      .apiErrorBannerIsDisplayed()
      .searchUnavailableMessageIsDisplayed()
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

  it('should be able to click a prisoner on the search page to arrive on the Overview page', () => {
    // Given
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()
    cy.visit('/search')

    // Then
    Page.verifyOnPage(PrisonerListPage) //
      .gotoOverviewPageForPrisoner('G6115VJ')

    // When
    Page.verifyOnPage(OverviewPage) //
      .isForPrisoner('G6115VJ')
  })
})
