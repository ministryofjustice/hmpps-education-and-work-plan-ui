/**
 * Cypress scenarios for the Overdue Sessions Lst page
 */
import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import OverdueSessionsPage from '../../pages/sessionList/OverdueSessionsPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Overdue sessions list page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 3 records (to match 3 overdue from the sessionSummary stub)
    cy.task('generateSessionSearchResponses', { numberOfRecords: 3, sessionStatus: SessionStatusValue.OVERDUE }).then(
      (sessions: Array<SessionSearchResponse>) => {
        cy.task('stubSearchSessionsByPrison', {
          sessionStatusType: SessionStatusValue.OVERDUE,
          pageOfSessions: sessions,
        })
      },
    )

    cy.signIn()
  })

  it('should go to overdue sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(OverdueSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should navigate directly to overdue sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/overdue`)

    // Then
    Page.verifyOnPage(OverdueSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the list of sessions', () => {
    // Given
    cy.task('stubSearchSessionsByPrison500Error', { sessionStatusType: SessionStatusValue.OVERDUE })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(OverdueSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the session summaries', () => {
    // Given
    cy.task('stubGetSessionSummary500Error', { sessionStatusType: SessionStatusValue.OVERDUE })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(OverdueSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not navigate directly to overdue sessions page given user does not have manager role', () => {
    // Given
    cy.signOut()
    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/sessions/overdue`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
