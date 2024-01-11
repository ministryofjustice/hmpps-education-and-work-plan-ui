import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import TimelinePage from '../../pages/overview/TimelinePage'

context('Prisoner Overview page - Timeline tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('getActionPlan', 'H4115SD')
    cy.task('stubGetInductionShortQuestionSet')
    cy.task('stubLearnerProfile', 'G6115VJ')
    cy.task('stubLearnerProfile', 'H4115SD')
    cy.task('stubLearnerEducation', 'G6115VJ')
    cy.task('stubLearnerEducation', 'H4115SD')
    cy.task('stubGetAllPrisons')
  })

  it('should display timeline given prisoner where one goal was created as part of their initial action plan', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetTimeline', prisonNumber) // Prison number G6115VJ has a timeline where 1 goal was created as part of their initial action plan

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Timeline')
    const timelinePage = Page.verifyOnPage(TimelinePage)

    // Then
    timelinePage //
      .activeTabIs('Timeline')
      .hasTimelineDisplayed()
      .hasLearningAndWorkProgressPlanEventWithOneGoalDisplayed()
  })

  it('should display timeline given prisoner where multiple goals were created as part of their initial action plan', () => {
    // Given
    const prisonNumber = 'H4115SD'
    cy.task('stubGetTimeline', prisonNumber) // Prison number H4115SD has a timeline where several goals were created as part of their initial action plan

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Timeline')
    const timelinePage = Page.verifyOnPage(TimelinePage)

    // Then
    timelinePage //
      .activeTabIs('Timeline')
      .hasTimelineDisplayed()
      .hasLearningAndWorkProgressPlanEventWithMultipleGoalsDisplayed()
  })

  it('should display timeline data unavailable message given timeline API is unavailable', () => {
    // Given
    cy.task('stubGetTimeline500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Timeline')
    const timelinePage = Page.verifyOnPage(TimelinePage)

    // Then
    timelinePage //
      .activeTabIs('Timeline')
      .hasTimelineUnavailableMessageDisplayed()
  })

  it('should display empty timeline message given prisoner has no timeline data', () => {
    // Given
    cy.task('stubGetTimeline404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Timeline')
    const timelinePage = Page.verifyOnPage(TimelinePage)

    // Then
    timelinePage //
      .activeTabIs('Timeline')
      .hasEmptyTimelineMessageDisplayed()
  })
})
