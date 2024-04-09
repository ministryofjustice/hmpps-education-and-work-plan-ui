import Page from '../../pages/page'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

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
    cy.task('createGoals')
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
      .stepTitleFieldIsFocussed(1, 2)
  })

  it('should be able to add an empty goal', () => {
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
    createGoalPage.addNewEmptyGoal()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNoErrors()
      .goalTitleFieldIsFocussed(2)
  })

  it('should create goals given valid form submission', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)
      .addNewEmptyStepToGoal(1)
      .setStepTitle('Attend course', 1, 2)
      .addNewEmptyStepToGoal(1)
      .setStepTitle('Take exam', 1, 3)
      .setGoalNote('Prisoner expects to complete course before release', 1)
      .addNewEmptyGoal()
      .setGoalTitle('Improve communication skills', 2)
      .setTargetCompletionDate0to3Months(2)
      .setStepTitle('Make friends on wing', 2, 1)

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.goals.size() == 2 && ' +
              "@.goals[0].prisonNumber == 'G6115VJ' && " +
              "@.goals[0].title == 'Learn French' && " +
              "@.goals[0].notes == 'Prisoner expects to complete course before release' && " +
              '@.goals[0].steps.size() == 3 && ' +
              "@.goals[0].steps[0].title == 'Book course' && @.goals[0].steps[0].sequenceNumber == '1' && " +
              "@.goals[0].steps[1].title == 'Attend course' && @.goals[0].steps[1].sequenceNumber == '2' && " +
              "@.goals[0].steps[2].title == 'Take exam' && @.goals[0].steps[2].sequenceNumber == '3' && " +
              "@.goals[1].prisonNumber == 'G6115VJ' && " +
              "@.goals[1].title == 'Improve communication skills' && " +
              "@.goals[1].notes == '' && " +
              '@.goals[1].steps.size() == 1 && ' +
              "@.goals[1].steps[0].title == 'Make friends on wing' && @.goals[1].steps[0].sequenceNumber == '1')]",
          ),
        ),
    )
  })

  it(`should display 'goals created successfully' message`, () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    let overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.doesNotHaveGoalsCreatedSuccessfullyMessage()

    const createGoalPage = overviewPage.clickAddGoalButton()

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)

    // When
    createGoalPage.submitPage()

    // Then
    overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .hasGoalsCreatedSuccessfullyMessage()
      .refreshPage()
      .doesNotHaveGoalsCreatedSuccessfullyMessage()
  })
})
