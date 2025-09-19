import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import AdditionalNeedsPage from '../../pages/overview/AdditionalNeedsPage'

context('Prisoner Overview page - Additional Needs tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetAllPrisons')
  })

  it('should display Additional Needs data', () => {
    // Given
    cy.task('stubLearnerAssessments')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasHealthAndSupportNeedsDisplayed()
  })

  it('should display no results message given curious API returns a 404', () => {
    // Given
    cy.task('stubLearnerAssessments404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoAssessmentsMessageDisplayed()
  })

  it('should display curious unavailable message given curious is unavailable', () => {
    // Given
    cy.task('stubLearnerAssessments500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasCuriousAssessmentsUnavailableMessageDisplayed()
  })
})
