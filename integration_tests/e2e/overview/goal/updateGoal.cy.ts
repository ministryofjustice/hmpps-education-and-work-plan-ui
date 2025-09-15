import Page from '../../../pages/page'
import UpdateGoalPage from '../../../pages/goal/UpdateGoalPage'
import OverviewPage from '../../../pages/overview/OverviewPage'
import ReviewUpdateGoalPage from '../../../pages/goal/ReviewUpdateGoalPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import Error404Page from '../../../pages/error404'
import Error500Page from '../../../pages/error500'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import GoalsPage from '../../../pages/overview/GoalsPage'
import GoalStatusValue from '../../../../server/enums/goalStatusValue'

context('Update a goal', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('getGoalsByStatus', { prisonNumber, status: GoalStatusValue.ACTIVE })
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerQualifications')
    cy.task('updateGoal')
  })

  const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'

  it('should be able to navigate directly to update goal page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`)

    // Then
    const updateGoalPage = Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage.isForGoal(goalReference)
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage //
      .clickViewInProgressGoalsButton()

    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    // When
    updateGoalPage //
      .clearGoalTitle()
      .setTargetCompletionDateFromValuePreviouslySetOnGoal()
      .submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should not submit the form and highlight field in error if there are validation errors on target completion date field', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage //
      .clickViewInProgressGoalsButton()

    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    // When
    updateGoalPage //
      .setTargetCompletionDate('01/91/xx91')
      .submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('targetCompletionDate')
      .hasTargetCompletionDateValue('01/91/xx91')
  })

  it('should be able to submit the form if no validation errors', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage //
      .clickViewInProgressGoalsButton()

    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    // When
    updateGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDateFromValuePreviouslySetOnGoal()
      .setFirstStepTitle('Obtain a French dictionary')
      .submitPage()

    // Then
    Page.verifyOnPage(ReviewUpdateGoalPage)
  })

  it('should be able to add a new step as part of updating a goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage //
      .clickViewInProgressGoalsButton()

    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    // When
    updateGoalPage //
      // The goal loaded from the wiremock stub data has 2 steps. After adding another step, the new step will be referenced as step 3
      .addAnotherStep()
      .setStepTitle(3, 'A brand new step')
      .setStepStatus(3, 'ACTIVE')
      .submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}`)) //
        .withRequestBody(
          matchingJsonPath(
            `$.steps[2].[?(@.stepReference == '' && @.sequenceNumber == '3' && @.title == 'A brand new step' && @.status == 'ACTIVE')]`,
          ),
        ),
    )
  })

  it('should be able to remove a step as part of updating a goal', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage //
      .clickViewInProgressGoalsButton()

    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    // When
    updateGoalPage //
      .clickRemoveButtonForSecondStep()
      .submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}`)) //
        .withRequestBody(matchingJsonPath(`$[?(@.goalReference == '${goalReference}' && @.steps.size() == 1)]`)),
    )
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')

    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it(`should render 404 page given specified goal is not found in the prisoner's plan`, () => {
    // Given
    const nonExistentGoalReference = 'c17ffa15-cf3e-409b-827d-e1e458dbd5e8'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${nonExistentGoalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it(`should render 500 page given error retrieving prisoner's goals`, () => {
    // Given
    cy.task('getGoalsByStatus500', { prisonNumber, status: GoalStatusValue.ACTIVE })
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })
})
