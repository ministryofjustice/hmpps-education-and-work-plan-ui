import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import GoalStatusValue from '../../../server/enums/goalStatusValue'
import { aValidGoalResponse } from '../../../server/testsupport/actionPlanResponseTestDataBuilder'
import ViewInProgressGoalsPage from '../../pages/goal/ViewInProgressGoalsPage'

context('In progress goals', () => {
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
    cy.task('retrieveGoals')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('retrieveGoals')
    cy.task('retrieveGoals500')
  })

  it('should be able to navigate to the view in progress goals page/tab from the overview page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    overviewPage.selectTab('Goals')

    // Then
    Page.verifyOnPage(ViewInProgressGoalsPage)
  })

  it('should not show the no in progress goals message if there are active goals', () => {
    // Given
    cy.signIn()
    const activeGoal = { ...aValidGoalResponse(), goalReference }
    cy.task('retrieveGoals', { status: GoalStatusValue.ACTIVE, goals: [activeGoal] })
    cy.visit(`/plan/${prisonNumber}/view/goals/in-progress`)

    // When
    const inProgressGoalsPage = Page.verifyOnPage(ViewInProgressGoalsPage)

    // Then
    inProgressGoalsPage //
      .noInProgressGoalsMessageShouldNotBeVisible()
  })

  it('should order goals by most recently updated', () => {
    // Given
    cy.signIn()
    const aGoalThatWasUpdatedFirst = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      updatedAt: '2024-01-01T09:30:00.000Z',
      title: 'I was updated first',
    }
    const aGoalThatWasMoreRecentlyUpdated = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      updatedAt: '2024-01-01T10:30:00.000Z',
      title: 'I was updated more recently',
    }
    cy.task('retrieveGoals', {
      status: GoalStatusValue.ACTIVE,
      goals: [aGoalThatWasUpdatedFirst, aGoalThatWasMoreRecentlyUpdated],
    })
    cy.visit(`/plan/${prisonNumber}/view/goals/in-progress`)

    // When
    const inProgressGoalsPage = Page.verifyOnPage(ViewInProgressGoalsPage)

    // Then
    inProgressGoalsPage //
      .hasNumberOfGoals(2)
      .goalSummaryCardAtPositionContains(1, aGoalThatWasMoreRecentlyUpdated.title)
      .goalSummaryCardAtPositionContains(2, aGoalThatWasUpdatedFirst.title)
  })

  it('should show updated date, person and prison', () => {
    // Given
    cy.signIn()
    const anUpdatedGoal = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      updatedAt: '2024-01-02T09:30:00.000Z',
      updatedAtPrison: 'BXI',
      title: 'An updated goal',
    }
    cy.task('retrieveGoals', {
      status: GoalStatusValue.ACTIVE,
      goals: [anUpdatedGoal],
    })
    cy.visit(`/plan/${prisonNumber}/view/goals/in-progress`)

    // When
    const inProgressGoalsPage = Page.verifyOnPage(ViewInProgressGoalsPage)

    // Then
    inProgressGoalsPage //
      .hasNumberOfGoals(1)
      .lastUpdatedHintAtPositionContains(0, 'Last updated on 02 January 2024 by Alex Smith, Brixton (HMP)')
  })

  it('should be able to navigate to the view in progress goals page and have it display a message when there are no in progress goals', () => {
    // Given
    cy.signIn()
    cy.task('retrieveGoals', { status: GoalStatusValue.ACTIVE, goals: [] })

    // When
    cy.visit(`/plan/${prisonNumber}/view/goals/in-progress`)
    Page.verifyOnPage(ViewInProgressGoalsPage)
    const inProgressGoalsPage = Page.verifyOnPage(ViewInProgressGoalsPage)

    // Then
    inProgressGoalsPage //
      .noInProgressGoalsMessageShouldBeVisible()
  })

  it('should display service unavailable message given API returns a 500', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals/in-progress`)
    cy.task('retrieveGoals500', { goals: [], problemRetrievingData: true })

    // When
    const inProgressGoalsPage = Page.verifyOnPage(ViewInProgressGoalsPage)

    // Then
    inProgressGoalsPage //
      .hasServiceUnavailableMessageDisplayed()
  })
})
