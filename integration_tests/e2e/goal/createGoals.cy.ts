import Page from '../../pages/page'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Create goals', () => {
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
    cy.task('stubGetInductionShortQuestionSet')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetAllPrisons')
  })

  it('should be able to navigate directly to Create Goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })

  it('should not be able to submit Create Goal page given validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    createGoalPage //
      .clearGoalTitle(1)
      .setTargetCompletionDate6to12Months(1)
      .clearStepTitle(1, 1)

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasErrorCount(2)
      .hasFieldInError('goals[0].title')
      .hasFieldInError('goals[0].steps[0].title')
  })

  it('should not be able to add an empty step to a goal given form has validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .clearStepTitle(1, 1)

    // When
    createGoalPage.addNewEmptyStepToGoal(1)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('goals[0].steps[0].title')
  })

  it('should be able to add an empty step to a goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)

    // When
    createGoalPage.addNewEmptyStepToGoal(1)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNoErrors()
      .goalHasNumberOfStepsFields(1, 2)
  })
})
