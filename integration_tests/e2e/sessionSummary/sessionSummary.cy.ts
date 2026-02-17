/**
 * Cypress scenarios for the Session Summary page
 */
import type { PersonResponse } from 'educationAndWorkPlanApiClient'
import Page from '../../pages/page'
import SessionsSummaryPage from '../../pages/sessionSummary/SessionsSummaryPage'
import PrisonerListPage from '../../pages/prisonerList/PrisonerListPage'

context(`Display the Sessions Summary screen`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')
  })

  it(`users with authority MANAGER should get the sessions summary page as their landing page straight after login`, () => {
    // Given
    cy.task('stubSignInAsUserWithManagerRole')

    // When
    cy.signIn()

    // Then
    Page.verifyOnPage(SessionsSummaryPage) //
      .hasNumberOfSessionsDue(7)
      .hasNumberOfSessionsOverdue(3)
      .hasNumberOfSessionsOnHold(11)
  })

  it('should be able to navigate directly to the session summary page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    Page.verifyOnPage(SessionsSummaryPage)
  })

  it('should display service unavailable message given API returns 404 for session summary call', () => {
    // Given
    cy.task('stubGetSessionSummary404Error')

    // When
    cy.signIn()

    // Then
    Page.verifyOnPage(SessionsSummaryPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should display service unavailable message given API returns 500 for session summary call', () => {
    // Given
    cy.task('stubGetSessionSummary500Error')

    // When
    cy.signIn()

    // Then
    Page.verifyOnPage(SessionsSummaryPage) //
      .apiErrorBannerIsDisplayed()
  })

  describe('scenarios that arrive on the prisoner list page', () => {
    let prisoners: Array<PersonResponse>

    beforeEach(() => {
      // Generate 10 Prisoner Search Summaries that will be displayed on the Prisoner List page by virtue of using them in the prisoner-search, CIAG, and Action Plan stubs
      cy.task('generatePeople', 10).then((people: Array<PersonResponse>) => {
        prisoners = people
        cy.task('stubSearchByPrison', {
          pageOfPrisoners: prisoners,
          totalRecords: prisoners.length,
        })

        prisoners.forEach(personResponse => {
          cy.task('stubSearchByPrison', {
            prisonerNameOrNumber: `${personResponse.forename} ${personResponse.surname}`,
            pageOfPrisoners: [personResponse],
            totalRecords: 1,
          })
        })
      })
    })

    it('should be able to click link to search all prisoners in prison', () => {
      // Given
      cy.signIn()

      // When
      Page.verifyOnPage(SessionsSummaryPage) //
        .clickLinkToSearchAllPrisonersInPrison()

      // Then
      Page.verifyOnPage(PrisonerListPage) //
        .hasResultsDisplayed(10)
    })

    it('should be able to enter a search term and arrive on the prisoner list page', () => {
      // Given
      cy.signIn()

      const nameToSearchFor = `${prisoners.at(1).forename} ${prisoners.at(1).surname}`

      // When
      Page.verifyOnPage(SessionsSummaryPage) //
        .setNameSearchTerm(nameToSearchFor)
        .submitPage()

      // Then
      Page.verifyOnPage(PrisonerListPage) //
        .hasSearchTerm(nameToSearchFor)
        .hasResultsDisplayed(1)
    })
  })
})
