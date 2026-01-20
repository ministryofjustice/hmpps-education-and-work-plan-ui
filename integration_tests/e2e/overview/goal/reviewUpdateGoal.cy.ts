import Page from '../../../pages/page'
import OverviewPage from '../../../pages/overview/OverviewPage'
import ReviewUpdateGoalPage from '../../../pages/goal/ReviewUpdateGoalPage'
import UpdateGoalPage from '../../../pages/goal/UpdateGoalPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import GoalsPage from '../../../pages/overview/GoalsPage'
import GoalStatusValue from '../../../../server/enums/goalStatusValue'

context('Review updated goal', () => {
  const prisonNumber = 'G6115VJ'
  const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('getGoalsByStatus', { prisonNumber, status: GoalStatusValue.ACTIVE })
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('updateGoal')
  })

  it('should not be able to navigate directly to Review Goal given previous forms have not been submitted', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update/review`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(prisonNumber)
  })

  it(`should navigate back to the update goal form when the 'go back to edit goal' button is clicked`, () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/goals#in-progress`)
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)
    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)

    // When
    reviewUpdateGoalPage.goBackToEditGoal()

    // Then
    Page.verifyOnPage(UpdateGoalPage).isForGoal(goalReference)
  })

  it('should be able to submit the form if no validation errors', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/goals#in-progress`)
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)

    // When
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')

    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update/review`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it(`should redisplay page with API error content given error updating prisoner's plan`, () => {
    // Given
    cy.signIn()
    cy.task('updateGoal500Error')

    cy.visit(`/plan/${prisonNumber}/view/goals#in-progress`)
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const inProgressGoalsPage = goalsPage.clickInProgressGoalsTab()
    const updateGoalPage = inProgressGoalsPage.clickUpdateButtonForGoal(goalReference)

    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.apiErrorBannerIsNotDisplayed()

    // When
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ReviewUpdateGoalPage) //
      .apiErrorBannerIsDisplayed()
  })
})
