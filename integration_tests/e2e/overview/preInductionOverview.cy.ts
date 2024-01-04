import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import CreateCiagInductionPage from '../../pages/ciagUi/createCiagInductionPage'
import Error500Page from '../../pages/error500'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'

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
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'A00001A')
    cy.task('stubGetCiagProfile404Error')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('getActionPlan', 'A00001A')
    cy.task('stubLearnerProfile', 'G6115VJ')
    cy.task('stubLearnerProfile', 'A00001A')
    cy.task('stubLearnerEducation', 'G6115VJ')
    cy.task('stubLearnerEducation', 'A00001A')
  })

  it('should render prisoner Overview page with Create Induction panel and Add Goal button given user has edit authority', () => {
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
      .hasAddGoalButtonDisplayed()
      .activeTabIs('Overview')
      .printThisPageIsNotPresent()
  })

  it('should render prisoner Overview page listing prisoner goals given prisoner has goals that were created pre-induction', () => {
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
      .hasGoalsDisplayed()
  })

  it('should render prisoner Overview page listing no prisoner goals given prisoner has no goals created pre-induction', () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()

    const prisonNumber = 'A00001A'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .hasNoGoalsDisplayed()
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

  it(`should navigate to Create Goal page given 'add goal' button is clicked`, () => {
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
    overviewPage.clickAddGoalButton()

    // Then
    Page.verifyOnPage(CreateGoalPage)
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
