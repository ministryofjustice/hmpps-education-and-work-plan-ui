import Page from '../../../pages/page'
import OverviewPage from '../../../pages/overview/OverviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import CompleteOrArchiveGoalPage from '../../../pages/goal/CompleteOrArchiveGoalPage'
import CompleteOrArchiveGoalValue from '../../../../server/enums/CompleteOrArchiveGoalValue'
import CompleteGoalPage from '../../../pages/goal/CompleteGoalPage'
import GoalsPage from '../../../pages/overview/GoalsPage'
import GoalStatusValue from '../../../../server/enums/goalStatusValue'

context('Complete a goal', () => {
  const prisonNumber = 'G6115VJ'
  const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'

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
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetAllPrisons')
    cy.task('completeGoal', { prisonNumber, goalReference })
  })

  it('should be able to navigate directly to complete goal page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/complete`)

    // Then
    const completeGoalPage = Page.verifyOnPage(CompleteGoalPage)
    completeGoalPage.isForGoal(goalReference)
  })

  it('should be able to navigate to complete goals page from overview', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const goalsPage = overviewPage.clickViewInProgressGoalsButton()
    const completeOrArchivePage = goalsPage //
      .checkOnInProgressGoalsTab()
      .clickCompleteOrArchiveButtonForGoal(goalReference)
    Page.verifyOnPage(CompleteOrArchiveGoalPage)
    completeOrArchivePage.selectOption(CompleteOrArchiveGoalValue.COMPLETE).submitPage()

    // Then
    Page.verifyOnPage(CompleteGoalPage)
  })

  it('should ask for confirmation and return to overview if choosing no', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/complete`)
    const completeGoalPage = Page.verifyOnPage(CompleteGoalPage)
    completeGoalPage //
      .clickNo()
    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerifyNoInteractions(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/complete`)),
    )
  })

  it('Should be able to complete a goal successfully without entering the optional notes', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)

    // When
    const completeOrArchiveGoalPage = goalsPage //
      .clickCompleteOrArchiveButtonForGoal(goalReference)

    Page.verifyOnPage(CompleteOrArchiveGoalPage)

    completeOrArchiveGoalPage //
      .selectOption(CompleteOrArchiveGoalValue.COMPLETE)
      .submitPage()

    const completeGoalPage = Page.verifyOnPage(CompleteGoalPage)

    completeGoalPage //
      .clearNotes()
      .clickYes()
    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goal Completed')

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/complete`)) //
        .withRequestBody(
          matchingJsonPath(`$[?(@.goalReference == '${goalReference}' && @.prisonId == 'BXI' && @.note == null)]`),
        ),
    )
  })

  it('Should be able to complete a goal successfully including entering some optional notes', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)

    // When
    const completeOrArchiveGoalPage = goalsPage //
      .clickCompleteOrArchiveButtonForGoal(goalReference)

    Page.verifyOnPage(CompleteOrArchiveGoalPage)

    completeOrArchiveGoalPage //
      .selectOption(CompleteOrArchiveGoalValue.COMPLETE)
      .submitPage()

    const completeGoalPage = Page.verifyOnPage(CompleteGoalPage)

    completeGoalPage //
      .enterNotes('Some additional notes explaining why we are completing this goal')
      .clickYes()
    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goal Completed')

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/complete`)) //
        .withRequestBody(
          matchingJsonPath(
            `$[?(@.goalReference == '${goalReference}' && ` +
              "@.prisonId == 'BXI' && " +
              "@.note == 'Some additional notes explaining why we are completing this goal')]",
          ),
        ),
    )
  })
})
