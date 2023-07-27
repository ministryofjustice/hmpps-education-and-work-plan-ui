import Page from '../../pages/page'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Add a step', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('getActionPlan', 'H4115SD')
    cy.task('stubLearnerProfile')
  })

  it('should not be able to navigate directly to Add Step given Create Goal has not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-step`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(prisonNumber)
  })

  it('should not be able to arrive on Add Step page, then change the prison number in the URL', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    let overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage.isForPrisoner(prisonNumber)

    const someOtherPrisonNumber = 'H4115SD'

    // When
    cy.visit(`/plan/${someOtherPrisonNumber}/goals/add-step`)

    // Then
    overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(someOtherPrisonNumber)
  })

  it('should not proceed to Add Note page given validation errors on Add Step page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
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

  it('should not proceed to Add Note page given user chooses to add another step', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    let addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isStepNumber(1)

    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')

    // When
    addStepPage.addAnotherStep()

    // Then
    addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .isStepNumber(2)
  })

  it('should move to Add Note page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
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
    Page.verifyOnPage(AddNotePage)
  })
})
