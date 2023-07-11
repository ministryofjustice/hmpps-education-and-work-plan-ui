import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'

context('Add a step', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
  })

  it('should not be able to navigate directly to add step given Create Goal has not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-step`)

    // Then
    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(prisonNumber)
  })

  it('should not be able to arrive on add step page, then change the prison number in the URL', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    let createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage.isForPrisoner(prisonNumber)

    const someOtherPrisonNumber = 'H4115SD'

    // When
    cy.visit(`/plan/${someOtherPrisonNumber}/goals/add-step`)

    // Then
    createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(someOtherPrisonNumber)
  })

  it('should not proceed to add note page given validation errors on add step page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .clearStepTitle()
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')

    // When
    addStepPage.submitPage()

    // Then
    Page.verifyOnPage(AddStepPage)
    addStepPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should not proceed to add note page given user chooses to add another step', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoal = Page.verifyOnPage(CreateGoalPage)
    createGoal //
      .setGoalTitle('Learn French')
      .submitPage()

    let addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isForGoal('Learn French')
      .isStepNumber(1)

    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')

    // When
    addStepPage.addAnotherStep()

    // Then
    addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isForGoal('Learn French')
      .isStepNumber(2)
  })

  it.skip('should move to add note page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')

    // When
    addStepPage.submitPage()

    // Then
    // assert we are on the next page
  })
})
