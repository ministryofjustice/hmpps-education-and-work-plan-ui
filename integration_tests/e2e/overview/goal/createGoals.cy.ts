import Page from '../../../pages/page'
import CreateGoalsPage from '../../../pages/goal/CreateGoalsPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import OverviewPage from '../../../pages/overview/OverviewPage'

context('Create goals', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('getActionPlan')
  })

  it('should be able to navigate directly to Create Goal page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })

  it('should not be able to submit Create Goal page given validation errors', () => {
    // Given
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

  it('should be able to add an empty step, and validation only performed on final form submission', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .clearStepTitle(1, 1)
      .addNewEmptyStepToGoal(1)
      .hasNoErrors()
      .goalTitleIs('Learn French', 1)
      .stepTitleIs('', 1, 1)
      .stepTitleIs('', 1, 2)

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasErrorCount(2)
      .hasFieldInError('goals[0].steps[0].title')
      .hasFieldInError('goals[0].steps[1].title')
  })

  it('should be able to add an empty step to a goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .hasNoRemoveStepButtons()
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)

    // When
    createGoalPage.addNewEmptyStepToGoal(1)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNumberOfRemoveStepButtonsForGoal(1, 2)
      .hasNoErrors()
      .goalHasNumberOfStepsFields(1, 2)
      .stepTitleFieldIsFocussed(1, 2)
  })

  it('should be able to remove a step from a goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .hasNoRemoveStepButtons()
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)
      .addNewEmptyStepToGoal(1)
      .hasNumberOfRemoveStepButtonsForGoal(1, 2)
      .setStepTitle('Attend course', 1, 2)
      .addNewEmptyStepToGoal(1)
      .hasNumberOfRemoveStepButtonsForGoal(1, 3)
      .setStepTitle('Take exam', 1, 3)

    // When
    createGoalPage.removeStep(1, 2) // remove step 2 ("Attend course")

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNoErrors()
      .goalHasNumberOfStepsFields(1, 2)
      .stepTitleFieldIsFocussed(1, 2)
      .stepTitleIs('Book course', 1, 1)
      .stepTitleIs('Take exam', 1, 2)
  })

  it('should be able to add an empty goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .hasNoRemoveGoalButtons()
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)

    // When
    createGoalPage.addNewEmptyGoal()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNumberOfRemoveGoalButtons(2)
      .hasNoErrors()
      .goalTitleFieldIsFocussed(2)
  })

  it('should be able to remove a goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .hasNoRemoveGoalButtons()
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Book course', 1, 1)
      .addNewEmptyGoal()
      .hasNumberOfRemoveGoalButtons(2)
      .setGoalTitle('Become a carpenter', 2)
      .setTargetCompletionDate6to12Months(2)
      .setStepTitle('Apply to get on woodworking activity', 2, 1)

    // When
    createGoalPage.removeGoal(1) // remove goal 1 ("Learn French")

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    createGoalPage //
      .hasNoRemoveGoalButtons()
      .hasNoErrors()
      .stepTitleFieldIsFocussed(1, 1)
      .goalTitleIs('Become a carpenter', 1)
  })

  it('should create goals given valid form submission and prisoner already has goals', () => {
    // Given
    cy.task('getActionPlan')
    cy.task('createGoals')
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
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goals added')
      .refreshPage()
      .doesNotHaveSuccessMessage()

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.goals.size() == 2 && ' +
              "@.goals[0].prisonId == 'BXI' && " +
              '@.goals[0].targetCompletionDate && ' + // assert the targetCompletionDate field exists in the request, but not it's value as the value is based on x months from today
              "@.goals[0].title == 'Learn French' && " +
              "@.goals[0].notes == 'Prisoner expects to complete course before release' && " +
              '@.goals[0].steps.size() == 3 && ' +
              "@.goals[0].steps[0].title == 'Book course' && @.goals[0].steps[0].sequenceNumber == '1' && " +
              "@.goals[0].steps[1].title == 'Attend course' && @.goals[0].steps[1].sequenceNumber == '2' && " +
              "@.goals[0].steps[2].title == 'Take exam' && @.goals[0].steps[2].sequenceNumber == '3' && " +
              "@.goals[1].prisonId == 'BXI' && " +
              '@.goals[1].targetCompletionDate && ' + // assert the targetCompletionDate field exists in the request, but not it's value as the value is based on x months from today
              "@.goals[1].title == 'Improve communication skills' && " +
              '@.goals[1].notes == null && ' +
              '@.goals[1].steps.size() == 1 && ' +
              "@.goals[1].steps[0].title == 'Make friends on wing' && @.goals[1].steps[0].sequenceNumber == '1')]",
          ),
        ),
    )
  })

  it('should create action plan given valid form submission and prisoner does not have any goals yet', () => {
    // Given
    cy.task('getActionPlan404Error')
    cy.task('createActionPlan')
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/create`)
    const createGoalPage = Page.verifyOnPage(CreateGoalsPage)

    createGoalPage //
      .setGoalTitle('Learn French', 1)
      .setTargetCompletionDate6to12Months(1)
      .setStepTitle('Attend course', 1, 1)

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goals added')
      .refreshPage()
      .doesNotHaveSuccessMessage()

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.goals.size() == 1 && ' +
              "@.goals[0].prisonId == 'BXI' && " +
              '@.goals[0].targetCompletionDate && ' + // assert the targetCompletionDate field exists in the request, but not it's value as the value is based on x months from today
              "@.goals[0].title == 'Learn French' && " +
              '@.goals[0].steps.size() == 1 && ' +
              "@.goals[0].steps[0].title == 'Attend course' && @.goals[0].steps[0].sequenceNumber == '1')]",
          ),
        ),
    )
  })
})
