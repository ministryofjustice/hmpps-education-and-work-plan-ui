import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import SupportNeedsPage from '../../pages/overview/SupportNeedsPage'

context('Prisoner Overview page - Support Needs tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
  })

  it('should display Support Needs data', () => {
    // Given
    cy.task('stubLearnerProfile')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Support needs')
    const supportNeedsPage = Page.verifyOnPage(SupportNeedsPage)

    // Then
    supportNeedsPage //
      .activeTabIs('Support needs')
      .hasHealthAndSupportNeedsDisplayed()
  })

  it('should display no results message given curious API returns a 404', () => {
    // Given
    cy.task('stubLearnerProfile404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Support needs')
    const supportNeedsPage = Page.verifyOnPage(SupportNeedsPage)

    // Then
    supportNeedsPage //
      .activeTabIs('Support needs')
      .hasNoDataMessageDisplayed()
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
    const supportNeedsPage = Page.verifyOnPage(SupportNeedsPage)

    // Then
    supportNeedsPage //
      .activeTabIs('Support needs')
      .hasCuriousUnavailableMessageDisplayed()
  })
})
