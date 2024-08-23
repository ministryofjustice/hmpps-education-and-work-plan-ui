import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import GoalStatusValue from '../../../server/enums/goalStatusValue'
import { aValidGoalResponse } from '../../../server/testsupport/actionPlanResponseTestDataBuilder'
import ViewArchivedGoalsPage from '../../pages/goal/ViewArchivedGoalsPage'
import { getRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import ReasonToArchiveGoalValue from '../../../server/enums/ReasonToArchiveGoalValue'

context('Unarchive a goal', () => {
  const prisonNumber = 'G6115VJ'
  const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'

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
    cy.task('getGoalsByStatus')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should be able to navigate directly to the view archived goals page and have it load archived goals only', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/archived-goals`)

    // Then
    Page.verifyOnPage(ViewArchivedGoalsPage)
    cy.wiremockVerify(getRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals?status=ARCHIVED`)))
  })

  it('should be able to navigate to the view archived goals page from the overview page', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const archivedGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ARCHIVED, goalReference }
    cy.task('getGoalsByStatus', { status: GoalStatusValue.ARCHIVED, goals: [archivedGoal] })
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickViewArchivedGoalsButton()

    // Then
    Page.verifyOnPage(ViewArchivedGoalsPage)
  })

  it('should not show the no archived goals message if there are archived goals', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const archivedGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ARCHIVED, goalReference }
    cy.task('getGoalsByStatus', { status: GoalStatusValue.ARCHIVED, goals: [archivedGoal] })
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const archivedGoalsPage = overviewPage.clickViewArchivedGoalsButton()

    // Then
    archivedGoalsPage //
      .noArchivedGoalsMessageShouldNotBeVisible()
  })

  it('should order goals by most recently archived', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const aGoalThatWasArchivedFirst = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      goalReference: uuidv4(),
      updatedAt: '2024-01-01T09:30:00.000Z',
      title: 'I was archived first',
    }
    const aGoalThatWasMoreRecentlyArchived = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      goalReference: uuidv4(),
      updatedAt: '2024-01-01T10:30:00.000Z',
      title: 'I was archived more recently',
    }
    cy.task('getGoalsByStatus', {
      status: GoalStatusValue.ARCHIVED,
      goals: [aGoalThatWasArchivedFirst, aGoalThatWasMoreRecentlyArchived],
    })
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const archivedGoalsPage = overviewPage.clickViewArchivedGoalsButton()

    // Then
    archivedGoalsPage //
      .hasNumberOfGoals(2)
      .goalSummaryCardAtPositionContains(1, aGoalThatWasMoreRecentlyArchived.title)
      .goalSummaryCardAtPositionContains(2, aGoalThatWasArchivedFirst.title)
  })

  it('should show archived date, person and prison as well as the reason', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const aGoalThatWasArchivedWithASpecificReason = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      goalReference: uuidv4(),
      updatedAt: '2024-01-02T09:30:00.000Z',
      updatedAtPrison: 'BXI',
      title: 'I was archived because the prisoner no longer wants to work towards the goal',
      archiveReason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
    }
    const aGoalThatWasArchivedWithOtherReason = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      goalReference: uuidv4(),
      updatedAt: '2024-01-01T10:30:00.000Z',
      updatedAtPrison: 'MDI',
      title: 'I was archived with other reason',
      archiveReason: ReasonToArchiveGoalValue.OTHER,
      archiveReasonOther: 'Some other reason',
    }
    cy.task('getGoalsByStatus', {
      status: GoalStatusValue.ARCHIVED,
      goals: [aGoalThatWasArchivedWithASpecificReason, aGoalThatWasArchivedWithOtherReason],
    })
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const archivedGoalsPage = overviewPage.clickViewArchivedGoalsButton()

    // Then
    archivedGoalsPage //
      .hasNumberOfGoals(2)
      .lastUpdatedHintAtPositionContains(1, 'Archived on 02 January 2024 by Alex Smith, Brixton (HMP)')
      .archiveReasonHintAtPositionContains(1, 'Reason: Prisoner no longer wants to work towards this goal')
      .lastUpdatedHintAtPositionContains(2, 'Archived on 01 January 2024 by Alex Smith, Moorland (HMP & YOI)')
      .archiveReasonHintAtPositionContains(2, 'Reason: Other - Some other reason')
  })

  it('should be able to navigate to the view archived goals page and have it display a message when there are no archived goals', () => {
    // Given
    cy.signIn()
    cy.task('getGoalsByStatus', { status: GoalStatusValue.ARCHIVED, goals: [] })

    // When
    cy.visit(`/plan/${prisonNumber}/view/archived-goals`)
    Page.verifyOnPage(ViewArchivedGoalsPage)
    const archivedGoalsPage = Page.verifyOnPage(ViewArchivedGoalsPage)

    // Then
    archivedGoalsPage //
      .noArchivedGoalsMessageShouldBeVisible()
  })
})
