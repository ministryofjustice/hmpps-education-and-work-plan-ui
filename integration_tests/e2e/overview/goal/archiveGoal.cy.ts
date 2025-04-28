import Page from '../../../pages/page'
import ArchiveGoalPage from '../../../pages/goal/ArchiveGoalPage'
import ReasonToArchiveGoalValue from '../../../../server/enums/ReasonToArchiveGoalValue'
import ReviewArchiveGoalPage from '../../../pages/goal/ReviewArchiveGoalPage'
import OverviewPage from '../../../pages/overview/OverviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import GoalsPage from '../../../pages/overview/GoalsPage'
import CompleteOrArchiveGoalPage from '../../../pages/goal/CompleteOrArchiveGoalPage'
import CompleteOrArchiveGoalValue from '../../../../server/enums/CompleteOrArchiveGoalValue'
import GoalStatusValue from '../../../../server/enums/goalStatusValue'

context('Archive a goal', () => {
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
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('archiveGoal')
    cy.task('stubGetAllPrisons')
  })

  it('should be able to navigate directly to archive goal page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // Then
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage.isForGoal(goalReference)
  })

  it('should be able to navigate to archived goals page from overview', () => {
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
    completeOrArchivePage.selectOption(CompleteOrArchiveGoalValue.ARCHIVE).submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reason')
  })

  it('should not submit the form if other reason not entered', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reasonOther')
  })

  it('should show a hint for the number of characters remaining', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason(''.padEnd(150, 'x'))
      .shouldHaveOtherReasonHint('You have 50 characters remaining')

    // now make it too long
    archiveGoalPage //
      .enterReason(''.padEnd(100, 'x'))
      .shouldHaveOtherReasonHint('You have 50 characters too many')
      .submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reasonOther')
  })

  it('should ask for confirmation and return to overview if choosing no', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
      .submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewArchiveGoalPage)
    reviewPage.clickNo()

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerifyNoInteractions(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`)),
    )
  })

  it('Should be able to archive a goal successfully without entering the optional notes', () => {
    // Given
    cy.task('archiveGoal', { prisonNumber, goalReference })
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)

    // When
    const completeOrArchiveGoalPage = goalsPage //
      .hasArchivedGoalsDisplayed()
      .hasNumberOfArchivedGoals(2)
      .clickCompleteOrArchiveButtonForGoal(goalReference)

    Page.verifyOnPage(CompleteOrArchiveGoalPage)

    completeOrArchiveGoalPage //
      .selectOption(CompleteOrArchiveGoalValue.ARCHIVE)
      .submitPage()

    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)

    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
      .clearNotes()
      .submitPage()

    const reviewPage = Page.verifyOnPage(ReviewArchiveGoalPage)
    reviewPage.clickYes()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goal archived')
      .hasNumberOfArchivedGoals(2)

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`)) //
        .withRequestBody(
          matchingJsonPath(
            `$[?(@.goalReference == '${goalReference}' && ` +
              "@.prisonId == 'BXI' && " +
              "@.reason == 'OTHER' && " +
              "@.note == '' && " +
              "@.reasonOther == 'Just because...')]",
          ),
        ),
    )
  })

  it('Should be able to archive a goal successfully including entering some optional notes', () => {
    // Given
    cy.task('archiveGoal', { prisonNumber, goalReference })
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)

    // When
    const completeOrArchiveGoalPage = goalsPage //
      .hasArchivedGoalsDisplayed()
      .hasNumberOfArchivedGoals(2)
      .clickCompleteOrArchiveButtonForGoal(goalReference)

    Page.verifyOnPage(CompleteOrArchiveGoalPage)

    completeOrArchiveGoalPage //
      .selectOption(CompleteOrArchiveGoalValue.ARCHIVE)
      .submitPage()

    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)

    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
      .enterNotes('Some additional notes explaining why we are archiving this goal')
      .submitPage()

    const reviewPage = Page.verifyOnPage(ReviewArchiveGoalPage)
    reviewPage.clickYes()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goal archived')
      .hasNumberOfArchivedGoals(2)

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`)) //
        .withRequestBody(
          matchingJsonPath(
            `$[?(@.goalReference == '${goalReference}' && ` +
              "@.prisonId == 'BXI' && " +
              "@.reason == 'OTHER' && " +
              "@.note == 'Some additional notes explaining why we are archiving this goal' && " +
              "@.reasonOther == 'Just because...')]",
          ),
        ),
    )
  })
})
