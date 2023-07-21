import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'

context('Prisoner Overview page - Support Needs tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should display curious unavailable message given curious is unavailable', () => {
    // Given
    cy.task('stubLearnerProfile401Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Support needs')

    // Then
    overviewPage //
      .activeTabIs('Support needs')
      .hasCuriousUnavailableMessageDisplayed()
  })
})
