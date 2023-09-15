import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'

context('Prisoner Overview page - Support Needs tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should display Support Needs data', () => {
    // Given
    cy.task('stubLearnerProfile')
    cy.task('stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Support needs')

    // Then
    overviewPage //
      .activeTabIs('Support needs')
      .hasHealthAndSupportNeedsDisplayed()
      .hasNeurodiversityDisplayed()
  })

  it('should display Support Needs data given curious API returns a 404', () => {
    // Given
    cy.task('stubLearnerProfile')
    cy.task('stubNeurodivergence404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Support needs')

    // Then
    overviewPage //
      .activeTabIs('Support needs')
      .hasHealthAndSupportNeedsDisplayed()
      .hasNeurodiversityDisplayed()
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
