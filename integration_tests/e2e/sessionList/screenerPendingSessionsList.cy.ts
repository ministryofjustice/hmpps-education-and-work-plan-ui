/**
 * Cypress scenarios for the Screener Pending Sessions List page
 */
import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import SessionSearchSortField from '../../../server/enums/sessionSearchSortField'
import SearchSortDirection from '../../../server/enums/searchSortDirection'
import ScreenerPendingSessionsPage from '../../pages/sessionList/ScreenerPendingSessionsPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Screener pending sessions list page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 7 records (to match the 7 screenerPendingInductions from the sessionSummary stub)
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 7,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        // this list defaults to sorting by prisoner name, not due by
        sortBy: SessionSearchSortField.PRISONER_NAME,
        pageOfSessions: sessions,
      })
    })

    cy.signIn()
  })

  it('should go to screener pending sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .hasNumberOfScreenersPending(7)
      .clickToGoToScreenerPendingSessionsPage()

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
      .hasResultsDisplayed(7)
  })

  it('should navigate directly to screener pending sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/screener-pending`)

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display the prisoner, location and release date columns only', () => {
    // Given

    // When
    cy.visit(`/sessions/screener-pending`)

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .hasColumnHeaders(['name', 'location', 'release-date'])
      // every screener pending session is an Induction, so there is no session type filter on this page
      .hasNoSessionTypeFilter()
  })

  it('should default to sorting by prisoner name ascending', () => {
    // Given

    // When
    cy.visit(`/sessions/screener-pending`)

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .isSortedBy('name', 'ascending')
  })

  it('should sort by prisoner name descending', () => {
    // Given
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 7,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        sortBy: SessionSearchSortField.PRISONER_NAME,
        sortDirection: SearchSortDirection.DESC,
        pageOfSessions: sessions,
      })
    })
    cy.visit(`/sessions/screener-pending`)

    // When
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .sortBy('name')

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .isSortedBy('name', 'descending')
  })

  it('should sort by location', () => {
    // Given
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 7,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        sortBy: SessionSearchSortField.CELL_LOCATION,
        pageOfSessions: sessions,
      })
    })
    cy.visit(`/sessions/screener-pending`)

    // When
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .sortBy('location')

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .isSortedBy('location', 'ascending')
  })

  it('should sort by release date', () => {
    // Given
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 7,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        sortBy: SessionSearchSortField.RELEASE_DATE,
        pageOfSessions: sessions,
      })
    })
    cy.visit(`/sessions/screener-pending`)

    // When
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .sortBy('release-date')

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .isSortedBy('release-date', 'ascending')
  })

  it('should filter the list by prisoner name or prison number', () => {
    // Given
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 1,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        sortBy: SessionSearchSortField.PRISONER_NAME,
        prisonerNameOrNumber: 'Smith',
        pageOfSessions: sessions,
      })
    })
    cy.visit(`/sessions/screener-pending`)

    // When
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .setNameOrPrisonNumberFilter('Smith')
      .applyFilters()

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .hasResultsDisplayed(1)
  })

  it('should paginate the list at 50 prisoners per page', () => {
    // Given
    cy.task('generateSessionSearchResponses', {
      numberOfRecords: 50,
      sessionStatus: SessionStatusValue.SCREENER_PENDING,
    }).then((sessions: Array<SessionSearchResponse>) => {
      cy.task('stubSearchSessionsByPrison', {
        sessionStatusType: SessionStatusValue.SCREENER_PENDING,
        sortBy: SessionSearchSortField.PRISONER_NAME,
        pageOfSessions: sessions,
        totalRecords: 120,
      })
    })

    // When
    cy.visit(`/sessions/screener-pending`)

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .hasResultsDisplayed(50)
    cy.get('[data-qa=session-list-pagination]').should('exist')
  })

  it('should display service unavailable message given problem calling education and work plan API for the list of sessions', () => {
    // Given
    cy.task('stubSearchSessionsByPrison500Error', {
      sessionStatusType: SessionStatusValue.SCREENER_PENDING,
      // this list sorts by prisoner name by default, so the error stub must match that query string
      sortBy: SessionSearchSortField.PRISONER_NAME,
    })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToScreenerPendingSessionsPage()

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the session summaries', () => {
    // Given
    cy.task('stubGetSessionSummary500Error', { sessionStatusType: SessionStatusValue.SCREENER_PENDING })

    // When
    cy.visit(`/sessions/screener-pending`)

    // Then
    Page.verifyOnPage(ScreenerPendingSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not navigate directly to screener pending sessions page given user does not have manager role', () => {
    // Given
    cy.signOut()
    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/sessions/screener-pending`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
