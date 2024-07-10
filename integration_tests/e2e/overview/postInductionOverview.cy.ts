import Page from '../../pages/page'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Prisoner Overview page - Post Induction', () => {
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
    cy.task('stubGetInduction')
    cy.task('getGoalsByStatus')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should render prisoner Overview page with Add Goal button given user has edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')

    const prisonNumber = 'G6115VJ'

    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .hasAddGoalButtonDisplayed()
      .activeTabIs('Overview')
      .printThisPageIsPresent()
  })

  it('should render prisoner Overview page without Add Goal and Update Goal buttons given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .doesNotHaveAddGoalButton()
      .doesNotHaveUpdateGoalButtons()
      .activeTabIs('Overview')
  })

  it('should display prisoner Goals', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const poverviewPage = Page.verifyOnPage(OverviewPage)
    poverviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasGoalsDisplayed()
      .hasGoalNotesExpander()
  })

  it('should display goals section given prisoner has no goals', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('getGoalsByStatus404')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasEmptyGoalsSection()
  })

  it('should display service unavailable message given EWP API returns a 500', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('getGoalsByStatus500')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasServiceUnavailableMessageDisplayed()
  })

  it('should navigate to Create Goal page given Add A Goal button is clicked', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickAddGoalButton()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })
})
