import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Prisoner Overview page - Work and Interests tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should display CIAG unavailable message given CIAG is unavailable', () => {
    // Given
    cy.task('stubGetCiagProfile500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Work and interests')

    // Then
    overviewPage //
      .activeTabIs('Work and interests')
      .hasCiagInductionApiUnavailableMessageDisplayed()
  })

  it('should display link to create CIAG Induction given prisoner does not have a CIAG Induction yet', () => {
    // Given
    cy.task('stubGetCiagProfile404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Work and interests')

    // Then
    overviewPage //
      .activeTabIs('Work and interests')
      .hasLinkToCreateCiagInductionDisplayed()
  })
})
