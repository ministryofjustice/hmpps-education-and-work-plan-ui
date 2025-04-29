/**
 * Cypress scenarios for the OnHold Sessions Lst page
 */
import type { PrisonerSearchSummary } from 'viewModels'
import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import OnHoldSessionsPage from '../../pages/sessionList/OnHoldSessionsPage'
import Error500Page from '../../pages/error500'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('On Hold sessions list page', () => {
  let prisonerSearchSummaries: Array<PrisonerSearchSummary>
  let prisonerSessions: Array<SessionResponse>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 11 records (to match 11 on-hold from the sessionSummary stub)
    cy.task('generatePrisonerSearchSummaries', 11).then(summaries => {
      prisonerSearchSummaries = summaries as Array<PrisonerSearchSummary>
      const prisonNumbers = prisonerSearchSummaries.map(prisoner => prisoner.prisonNumber)
      cy.task('stubPrisonerListFromPrisonerSearchSummaries', summaries)
      cy.task('generatePrisonerSessionResponses', { prisonNumbers, status: SessionStatusValue.ON_HOLD }).then(
        sessions => {
          prisonerSessions = sessions as Array<SessionResponse>
          cy.task('stubGetSessionsForPrisoners', { prisonerSessions, status: SessionStatusValue.ON_HOLD })
        },
      )
    })

    cy.signIn()
  })

  it('should go to on-hold sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(OnHoldSessionsPage)
  })

  it('should navigate directly to on-hold sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/on-hold`)

    // Then
    Page.verifyOnPage(OnHoldSessionsPage)
  })

  it('display error page given problem calling prisoner search for the list of prisoners', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.ON_HOLD)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
  })

  it('display error page given problem calling education and work plan API for the list of prisoner sessions', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.ON_HOLD)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToOnHoldSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
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
