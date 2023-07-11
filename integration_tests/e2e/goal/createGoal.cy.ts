import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Create a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should render initial create goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    const page = Page.verifyOnPage(CreateGoalPage)
    page.isForPrisoner(prisonNumber)
  })

  it('should not proceed to add step page given validation errors on create goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const page = Page.verifyOnPage(CreateGoalPage)
    page //
      .setGoalTitle('Learn French')
      .clearGoalReviewDate()

    // When
    page.submitPage()

    // Then
    Page.verifyOnPage(CreateGoalPage)
    page //
      .hasErrorCount(1)
      .hasFieldInError('reviewDate')
  })

  it('should create a valid goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoal = Page.verifyOnPage(CreateGoalPage)
    createGoal //
      .setGoalTitle('Learn French')
      .setGoalReviewDate(23, 12, 2024)
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isForGoal('Learn French')
      .isStepNumber(1)

    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDate(23, 12, 2024)

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
