import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'

context('Create a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
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

  it('should create a valid goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const page = Page.verifyOnPage(CreateGoalPage)
    page.setGoalTitle('Learn French')
    page.setGoalReviewDate(23, 12, 2024)

    // When
    page.submitPage()

    // Then
    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage.isForGoal('Learn French')

    addStepPage.setStepTitle('Book French course')
    addStepPage.setStepTargetDate(23, 12, 2024)
  })
})
