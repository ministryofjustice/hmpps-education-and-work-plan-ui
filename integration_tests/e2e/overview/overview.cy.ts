import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Prisoner Overview page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
  })

  it('should render prisoner Overview page with Add Goal button given user has edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const page = Page.verifyOnPage(OverviewPage)
    page //
      .isForPrisoner(prisonNumber)
      .hasAddGoalButtonDisplayed()
      .activeTabIs('Overview')
  })

  it('should render prisoner Overview page without Add Goal button given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const page = Page.verifyOnPage(OverviewPage)
    page //
      .isForPrisoner(prisonNumber)
      .doesNotHaveAddGoalButton()
      .activeTabIs('Overview')
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
    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(prisonNumber)
  })

  it('should have the DPS breadcrumb which does not include the current page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasBreadcrumb().breadcrumbDoesNotIncludeCurrentPage()
  })
})
