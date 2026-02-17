/**
 * Cypress scenarios for the Due Sessions Lst page
 */
import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import AuthorisationErrorPage from '../../pages/authorisationError'
import DueSessionsPage from '../../pages/sessionList/DueSessionsPage'

context('Due sessions list page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 7 records (to match 7 due from the sessionSummary stub)
    cy.task('generateSessionSearchResponses', { numberOfRecords: 7, sessionStatus: SessionStatusValue.DUE }).then(
      (sessions: Array<SessionSearchResponse>) => {
        cy.task('stubSearchSessionsByPrison', { sessionStatusType: SessionStatusValue.DUE, pageOfSessions: sessions })
      },
    )

    cy.signIn()
  })

  it('should go to due sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(DueSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should navigate directly to due sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/due`)

    // Then
    Page.verifyOnPage(DueSessionsPage) //
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the list of sessions', () => {
    // Given
    cy.task('stubSearchSessionsByPrison500Error', { sessionStatusType: SessionStatusValue.DUE })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(DueSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display service unavailable message given problem calling education and work plan API for the session summaries', () => {
    // Given
    cy.task('stubGetSessionSummary500Error', { sessionStatusType: SessionStatusValue.DUE })

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(DueSessionsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should not navigate directly to due sessions page given user does not have manager role', () => {
    // Given
    cy.signOut()
    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/sessions/due`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
