/**
 * Cypress scenarios for the OnHold Sessions Lst page
 */
import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import OnHoldSessionsPage from '../../pages/sessionList/OnHoldSessionsPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('On Hold sessions list page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 11 records (to match 11 on-hold from the sessionSummary stub)
    cy.task('generateSessionSearchResponses', { numberOfRecords: 11, sessionStatus: SessionStatusValue.ON_HOLD }).then(
      (sessions: Array<SessionSearchResponse>) => {
        cy.task('stubSearchSessionsByPrison', {
          sessionStatusType: SessionStatusValue.ON_HOLD,
          pageOfSessions: sessions,
        })
      },
    )

    cy.signIn()
  })

  it('should go to on-hold sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(OnHoldSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should navigate directly to on-hold sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/on-hold`)

    // Then
    Page.verifyOnPage(OnHoldSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the list of sessions', () => {
    // Given
    cy.task('stubSearchSessionsByPrison500Error', { sessionStatusType: SessionStatusValue.ON_HOLD })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(OnHoldSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the session summaries', () => {
    // Given
    cy.task('stubGetSessionSummary500Error', { sessionStatusType: SessionStatusValue.ON_HOLD })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(OnHoldSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not navigate directly to on-hold sessions page given user does not have manager role', () => {
    // Given
    cy.signOut()
    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/sessions/on-hold`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
