import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'

context('Add a step', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it.skip('should move to add note page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.setGoalTitle('Learn French')
    createGoalPage.setGoalReviewDate(23, 12, 2024)
    createGoalPage.submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage.setStepTitle('Book French course')
    addStepPage.setStepTargetDate(23, 12, 2024)

    // When
    addStepPage.submitPage()

    // Then
    // assert we are on the next page
  })
})
