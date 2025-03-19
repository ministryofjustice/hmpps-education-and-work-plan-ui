import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import HistoryPage from '../../pages/overview/HistoryPage'
import GoalsPage from '../../pages/overview/GoalsPage'

context('Prisoner Overview page - History tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getPrisonerById', 'G5005GD')
    cy.task('stubGetInduction')
    cy.task('stubLearnerProfile', 'G6115VJ')
    cy.task('stubLearnerProfile', 'H4115SD')
    cy.task('stubLearnerProfile', 'G5005GD')
    cy.task('stubLearnerEducation', 'G6115VJ')
    cy.task('stubLearnerEducation', 'H4115SD')
    cy.task('stubLearnerEducation', 'G5005GD')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan')
  })

  it('should display history tab containing timeline given prisoner where one goal was created as part of their initial action plan', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetTimeline', prisonNumber) // Prison number G6115VJ has a timeline where 1 goal was created as part of their initial action plan

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)

    // Then
    historyPage //
      .activeTabIs('History')
      .hasTimelineDisplayed()
      .hasTimelineEventsInOrder([
        'PRISON_RELEASE',
        'PRISON_TRANSFER',
        'GOAL_CREATED',
        'ACTION_PLAN_CREATED',
        'PRISON_ADMISSION',
      ])
  })

  it('should display history tab containing timeline given prisoner where multiple goals were created as part of their initial action plan', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('stubGetTimeline', prisonNumber) // Prison number H4115SD has a timeline where several goals were created as part of their initial action plan
    cy.task('getActionPlan', prisonNumber)

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)

    // Then
    historyPage //
      .activeTabIs('History')
      .hasTimelineDisplayed()
      .hasTimelineEventsInOrder(['MULTIPLE_GOALS_CREATED', 'ACTION_PLAN_CREATED', 'PRISON_ADMISSION'])
  })

  it('should display history tab containing timeline given prisoner where goals have been archived and un-archived', () => {
    // Given
    const prisonNumber = 'G5005GD'
    cy.task('stubGetTimeline', prisonNumber) // Prison number G5005GD has a timeline where 4 goals have been achived, and 1 goal un-archived
    cy.task('getActionPlan', prisonNumber)

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)

    // Then
    historyPage //
      .activeTabIs('History')
      .hasTimelineDisplayed()
      .hasTimelineEventsInOrder([
        'GOAL_UNARCHIVED',
        'GOAL_ARCHIVED',
        'GOAL_ARCHIVED',
        'GOAL_ARCHIVED',
        'GOAL_ARCHIVED',
        'MULTIPLE_GOALS_CREATED',
        'ACTION_PLAN_CREATED',
        'PRISON_ADMISSION',
      ])
  })

  it('should display history tab containing timeline data unavailable message given timeline API is unavailable', () => {
    // Given
    cy.task('stubGetTimeline500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)

    // Then
    historyPage //
      .activeTabIs('History')
      .hasTimelineUnavailableMessageDisplayed()
  })

  it('should display history tab containing empty timeline message given prisoner has no timeline data', () => {
    // Given
    cy.task('stubGetTimeline404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)

    // Then
    historyPage //
      .activeTabIs('History')
      .hasEmptyTimelineMessageDisplayed()
  })

  it('should navigate to archived goals tab when view archived goal button is clicked', () => {
    // Given
    const prisonNumber = 'G5005GD'
    cy.task('stubGetTimeline', prisonNumber) // Prison number G5005GD has a timeline where 4 goals have been achived, and 1 goal un-archived
    cy.task('getActionPlan', prisonNumber)

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)
    historyPage.clickViewArchivedGoalsButton()

    // Then
    const goalsPage = Page.verifyOnPage(GoalsPage)
    goalsPage //
      .checkOnArchivedGoalsTab()
  })

  it('should navigate to in progress goals tab when view goals button is clicked', () => {
    // Given
    const prisonNumber = 'G5005GD'
    cy.task('stubGetTimeline', prisonNumber)
    cy.task('getActionPlan', prisonNumber)

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('History')
    const historyPage = Page.verifyOnPage(HistoryPage)
    historyPage.clickViewGoalsButton()

    // Then
    const goalsPage = Page.verifyOnPage(GoalsPage)
    goalsPage //
      .checkOnInProgressGoalsTab()
  })
})
