/**
 * Cypress scenarios for the Overdue Sessions Lst page
 */
import type { PrisonerSearchSummary } from 'viewModels'
import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import OverdueSessionsPage from '../../pages/sessionList/OverdueSessionsPage'
import Error500Page from '../../pages/error500'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Overdue sessions list page', () => {
  let prisonerSearchSummaries: Array<PrisonerSearchSummary>
  let prisonerSessions: Array<SessionResponse>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 3 records (to match 3 overdue from the sessionSummary stub)
    cy.task('generatePrisonerSearchSummaries', 3).then(summaries => {
      prisonerSearchSummaries = summaries as Array<PrisonerSearchSummary>
      const prisonNumbers = prisonerSearchSummaries.map(prisoner => prisoner.prisonNumber)
      cy.task('stubPrisonerListFromPrisonerSearchSummaries', summaries)
      cy.task('generatePrisonerSessionResponses', { prisonNumbers, status: SessionStatusValue.OVERDUE }).then(
        sessions => {
          prisonerSessions = sessions as Array<SessionResponse>
          cy.task('stubGetSessionsForPrisoners', { prisonerSessions, status: SessionStatusValue.OVERDUE })
        },
      )
    })

    cy.signIn()
  })

  it('should go to overdue sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(OverdueSessionsPage)
  })

  it('should navigate directly to overdue sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/overdue`)

    // Then
    Page.verifyOnPage(OverdueSessionsPage)
  })

  it('display error page given problem calling prisoner search for the list of prisoners', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.OVERDUE)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
  })

  it('display error page given problem calling education and work plan API for the list of prisoner sessions', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.OVERDUE)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOverdueSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
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
