import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'

context('Add a note', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
  })

  it('should not be able to navigate directly to add note given Create Goal and Add Step has not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-note`)

    // Then
    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(prisonNumber)
  })

  it('should not be able to arrive on add note page, then change the prison number in the URL', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    let createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .setGoalReviewDate(23, 12, 2024)
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDate(23, 12, 2024)
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.isForPrisoner(prisonNumber)

    const someOtherPrisonNumber = 'H4115SD'

    // When
    cy.visit(`/plan/${someOtherPrisonNumber}/goals/add-note`)

    // Then
    createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(someOtherPrisonNumber)
  })

  it('should not be able to navigate directly to add note given Create Goal has been submitted but Add Step has not', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .setGoalReviewDate(23, 12, 2024)
      .submitPage()

    Page.verifyOnPage(AddStepPage)

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-note`)

    // Then
    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isForPrisoner(prisonNumber)
      .isStepNumber(1)
  })

  it.skip('should move to review goals page', () => {
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
    addStepPage.submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")

    // When
    addNotePage.submitPage()

    // Then
    // assert we are on the next page
  })
})
