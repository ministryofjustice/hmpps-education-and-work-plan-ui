import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Create a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should not be able to navigate directly to Create Goal page given user has not clicked Add A Goal from overview page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(prisonNumber)
  })

  it('should not proceed to Add Step page given validation errors on Create Goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    createGoalPage //
      .clearGoalTitle()

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should create a valid goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isForGoal('Learn French')
      .isStepNumber(1)

    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')

    // When
    addStepPage.submitPage()

    // Then
    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.isForPrisoner(prisonNumber)

    // addNotePage.setNote("Pay close attention to the prisoner's behaviour")
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
