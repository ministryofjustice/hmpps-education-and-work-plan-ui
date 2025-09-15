import Page from '../../../pages/page'
import UnarchiveGoalPage from '../../../pages/goal/UnarchiveGoalPage'
import OverviewPage from '../../../pages/overview/OverviewPage'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { putRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import GoalsPage from '../../../pages/overview/GoalsPage'
import GoalStatusValue from '../../../../server/enums/goalStatusValue'

context('Unarchive a goal', () => {
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
    cy.task('getGoalsByStatus', { prisonNumber, status: GoalStatusValue.ARCHIVED })
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('unarchiveGoal')
  })

  it('should be able to navigate directly to the unarchive goal page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/unarchive`)

    // Then
    const unarchiveGoalPage = Page.verifyOnPage(UnarchiveGoalPage)
    unarchiveGoalPage.isForGoal(goalReference)
  })

  it('should be able to navigate to the unarchive goal page from the overview page', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage //
      .clickViewArchivedGoalsButton()

    // Then
    const goalsPage = Page.verifyOnPage(GoalsPage)
    const archivedGoalsPage = goalsPage.clickArchivedGoalsTab()
    const unarchiveGoalPage = archivedGoalsPage.clickReactivateButtonForGoal(goalReference, 1)
    unarchiveGoalPage.isForGoal(goalReference)
  })

  it('should not be able to get to the unarchive goal page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/unarchive`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it(`should unarchive goal and display 'Goal reactivated' message on the Overview page`, () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/unarchive`)
    const unarchiveGoalPage = Page.verifyOnPage(UnarchiveGoalPage)

    // When
    unarchiveGoalPage.clickYes()

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .hasSuccessMessage('Goal reactivated')
      .refreshPage()
      .doesNotHaveSuccessMessage()
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`)) //
        .withRequestBody(matchingJsonPath(`$[?(@.goalReference == '${goalReference}' && @.prisonId == 'BXI')]`)),
    )
  })

  it(`should not unarchive goal and display Archived Goals page given user clicks No`, () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/unarchive`)
    const unarchiveGoalPage = Page.verifyOnPage(UnarchiveGoalPage)

    // When
    unarchiveGoalPage.clickNo()

    // Then
    Page.verifyOnPage(GoalsPage)
    cy.wiremockVerifyNoInteractions(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`)),
    )
  })
})
