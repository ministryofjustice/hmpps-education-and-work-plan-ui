import Page from '../../../pages/page'
import OverviewPage from '../../../pages/overview/OverviewPage'

context('View goals', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should be able to navigate to the view archived goals tab and have it load archived goals only', () => {
    // Given
    cy.signIn()
    cy.task('getActionPlan')
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const goalsPage = overviewPage.clickViewArchivedGoalsButton()

    // Then
    goalsPage //
      .checkOnArchivedGoalsTab()
      .archivedGoalSummaryCardAtPositionContains(0, 'Book French course')
  })

  it('should be able to navigate to the view completed goals tab and have it load completed goals only', () => {
    // Given
    cy.signIn()
    cy.task('getActionPlan')
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const goalsPage = overviewPage.clickViewCompletedGoalsButton()

    // Then
    goalsPage //
      .checkOnCompletedGoalsTab()
      .completedGoalSummaryCardAtPositionContains(0, 'Learn first aid')
  })

  it('should be able to navigate to the view in progress goals tab and have it load in progress goals only', () => {
    // Given
    cy.signIn()
    cy.task('getActionPlan')
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const goalsPage = overviewPage.clickViewInProgressGoalsButton()

    // Then
    goalsPage //
      .checkOnInProgressGoalsTab()
      .inProgressGoalSummaryCardAtPositionContains(0, 'Book wood work course')
  })
})
