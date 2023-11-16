import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import CreateCiagInductionPage from '../../pages/ciagUi/createCiagInductionPage'
import Error500Page from '../../pages/error500'

context('Prisoner Overview page - Pre Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetCiagProfile404Error')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should render prisoner Overview page with Create Induction panel given user has edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .activeTabIs('Overview')
      .printThisPageIsNotPresent()
  })

  it(`should navigate to CIAG create induction page given 'make a progress plan' is clicked`, () => {
    // Given
    cy.task('stubCreateCiagInductionUi')
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    cy.visit(`/plan/${prisonNumber}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .activeTabIs('Overview')

    // When
    overviewPage.clickMakeProgressPlan()

    // Then
    Page.verifyOnPage(CreateCiagInductionPage)
  })

  it('should display service unavailable message given CIAG API returns a 500', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.signIn()

    const prisonNumber = 'G6115VJ'
    cy.task('stubGetCiagProfile500Error')

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })
})
