import Page from '../../../pages/page'
import ArchiveGoalPage from '../../../pages/goal/ArchiveGoalPage'
import ReasonToArchiveGoalValue from '../../../../server/enums/ReasonToArchiveGoalValue'
import ReviewArchiveGoalPage from '../../../pages/goal/ReviewArchiveGoalPage'
import OverviewPage from '../../../pages/overview/OverviewPage'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import GoalsPage from '../../../pages/goal/GoalsPage'

context('Archive a goal', () => {
  const prisonNumber = 'G6115VJ'
  const goalToArchive = {
    goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
    title: 'Learn French',
    status: 'ACTIVE',
    steps: [
      {
        stepReference: '177e45eb-c8fe-438b-aa81-1bf9157efa05',
        title: 'Book French course',
        status: 'NOT_STARTED',
        sequenceNumber: 1,
      },
      {
        stepReference: '32992dd1-7dc6-4480-b2fc-61bc36a6a775',
        title: 'Complete French course',
        status: 'NOT_STARTED',
        sequenceNumber: 2,
      },
    ],
    createdBy: 'auser_gen',
    createdAt: '2023-07-20T08:29:15.386Z',
    updatedBy: 'auser_gen',
    updatedAt: '2023-07-20T08:29:15.386Z',
    targetCompletionDate: '2124-01-29',
    notes: 'Billy will struggle to concentrate for long periods.',
  }

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
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('archiveGoal')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan')
  })

  it('should be able to navigate directly to archive goal page', () => {
    // Given
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
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
    const goalsPage = overviewPage.clickViewArchivedGoalsButton()

    // Then
    goalsPage.checkOnArchivedGoalsTab()
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
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
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
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
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
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
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
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

  it('Should be able to archive a goal successfully', () => {
    // Given
    const { goalReference } = goalToArchive
    cy.task('archiveGoal', { prisonNumber, goalReference })
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)

    // When
    const archiveGoalPage = goalsPage //
      .hasArchivedGoalsDisplayed()
      .hasNumberOfArchivedGoals(2)
      .clickArchiveButtonForFirstGoal()

    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
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
            `$[?(@.goalReference == '${goalReference}' && @.reason == 'OTHER' && @.reasonOther == 'Just because...')]`,
          ),
        ),
    )
  })
})
