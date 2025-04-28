/**
 * Cypress scenarios for the Due Sessions Lst page
 */
import type { PrisonerSearchSummary } from 'viewModels'
import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import Error500Page from '../../pages/error500'
import AuthorisationErrorPage from '../../pages/authorisationError'
import DueSessionsPage from '../../pages/sessionList/DueSessionsPage'

context('Due sessions list page', () => {
  let prisonerSearchSummaries: Array<PrisonerSearchSummary>
  let prisonerSessions: Array<SessionResponse>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')

    // Generate 7 records (to match 7 due from the sessionSummary stub)
    cy.task('generatePrisonerSearchSummaries', 7).then(summaries => {
      prisonerSearchSummaries = summaries as Array<PrisonerSearchSummary>
      const prisonNumbers = prisonerSearchSummaries.map(prisoner => prisoner.prisonNumber)
      cy.task('stubPrisonerListFromPrisonerSearchSummaries', summaries)
      cy.task('generatePrisonerSessionResponses', { prisonNumbers, status: SessionStatusValue.DUE }).then(sessions => {
        prisonerSessions = sessions as Array<SessionResponse>
        cy.task('stubGetSessionsForPrisoners', { prisonerSessions, status: SessionStatusValue.DUE })
      })
    })

    cy.signIn()
  })

  it('should go to due sessions page from the session summary page', () => {
    // Given

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(DueSessionsPage)
  })

  it('should navigate directly to due sessions page', () => {
    // Given

    // When
    cy.visit(`/sessions/due`)

    // Then
    Page.verifyOnPage(DueSessionsPage)
  })

  it('display error page given problem calling prisoner search for the list of prisoners', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.DUE)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
  })

  it('display error page given problem calling education and work plan API for the list of prisoner sessions', () => {
    // Given
    cy.task('stubGetSessionsForPrisoners500Error', SessionStatusValue.DUE)

    // When
    Page.verifyOnPage(SessionsSummaryPage) //
      .clickToGoToDueSessionsPage()

    // Then
    Page.verifyOnPage(Error500Page)
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
