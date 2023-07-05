import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'

context('Add a step', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should not proceed to add note page given validation errors on add step page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .setGoalReviewDate(23, 12, 2024)
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .clearStepTitle()
      .setStepTargetDate(23, 12, 2024)

    // When
    addStepPage.submitPage()

    // Then
    Page.verifyOnPage(AddStepPage)
    addStepPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it.skip('should move to add note page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .setGoalReviewDate(23, 12, 2024)
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDate(23, 12, 2024)

    // When
    addStepPage.submitPage()

    // Then
    // assert we are on the next page
  })
})
