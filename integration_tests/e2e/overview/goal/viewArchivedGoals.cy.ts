import Page from '../../../pages/page'
import OverviewPage from '../../../pages/overview/OverviewPage'
import GoalsPage from '../../../pages/goal/GoalsPage'

context('Unarchive a goal', () => {
  const prisonNumber = 'G6115VJ'

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
  })

  it('should be able to navigate to the view archived goals page from the overview page', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage //
      .clickViewArchivedGoalsButton()
      .hasNumberOfArchivedGoals(2)

    // Then
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()

    // Then
    Page.verifyOnPage(GoalsPage)
    archivedGoalsPage.hasArchivedGoalsDisplayed()
  })

  it('should not show the no archived goals message if there are archived goals', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/goals#archived-goals`)

    // When
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()

    // Then
    archivedGoalsPage //
      .noArchivedGoalsMessageShouldNotBeVisible()
  })

  it('should order goals by most recently archived', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickViewArchivedGoalsButton()
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()

    // Then
    archivedGoalsPage //
      .archivedGoalSummaryCardAtPositionContains(1, '22 August 2023')
      .archivedGoalSummaryCardAtPositionContains(2, '22 July 2023')
  })

  it('should show archived date, person and prison as well as the reason', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickViewArchivedGoalsButton()
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()

    // Then
    archivedGoalsPage //
      .hasNumberOfArchivedGoals(2)
      .lastUpdatedHintAtPositionContains(3, 'Archived on 22 August 2023 by George Costanza, Moorland (HMP & YOI)')
      .archiveReasonHintAtPositionContains(1, 'Reason: Prisoner no longer wants to work towards this goal')
      .lastUpdatedHintAtPositionContains(4, 'Archived on 22 July 2023 by George Costanza, Moorland (HMP & YOI)')
      .archiveReasonHintAtPositionContains(
        2,
        'Reason: Work or education activity needed to complete goal is not available in this prison',
      )
  })

  it('should be able to navigate to the view archived goals page and have it display a message when there are no archived goals', () => {
    // Given
    cy.signIn()
    const prisonNumberForPrisonerWithNoGoals = 'A00001A'
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoGoals)
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoGoals)

    // When
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoGoals}/view/goals#archived-goals`)
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()

    // Then
    archivedGoalsPage //
      .noArchivedGoalsMessageShouldBeVisible()
  })
})
