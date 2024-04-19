import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import Error500Page from '../../pages/error500'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'

context('Prisoner Overview page - Pre Induction', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
    cy.task('getActionPlan')
    cy.task('stubGetInduction404Error')
  })

  it('should render prisoner Overview page with Create Induction panel and Add Goal button given user has edit authority', () => {
    // Given

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
    const prisonNumberForPrisonerWithNoGoals = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoGoals)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoGoals)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoGoals)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoGoals)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoGoals)

    // When
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoGoals}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumberForPrisonerWithNoGoals)
      .isPreInduction()
      .hasNoGoalsDisplayed()
  })

  it(`should navigate to create Induction page given 'make a progress plan' is clicked`, () => {
    // Given
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .activeTabIs('Overview')

    // When
    overviewPage.clickMakeProgressPlan()

    // Then
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/overview`)
  })

  it(`should navigate to Create Goal page given 'add goal' button is clicked`, () => {
    // Given
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .activeTabIs('Overview')

    // When
    overviewPage.clickAddGoalButton()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })

  it('should display service unavailable message given PLP API returns a 500 when retrieving the Induction', () => {
    // Given
    cy.task('stubGetInduction500Error')

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })
})
