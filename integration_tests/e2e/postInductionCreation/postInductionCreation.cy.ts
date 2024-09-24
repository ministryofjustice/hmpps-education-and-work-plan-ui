/**
 * Cypress scenarios for the routes immediately following CIAG UI Induction creation.
 *
 * These scenarios are for the route that the CIAG UI redirects the user to following creation of an Induction.
 * Depending on whether the prisoner has an Action Plan with goals or not, we expect the user to either be shown
 * the Overview page, or the initial Create Goal page.
 */
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import GoalStatusValue from '../../../server/enums/goalStatusValue'
import { aValidGoalResponse } from '../../../server/testsupport/actionPlanResponseTestDataBuilder'

context(`Show the relevant screen after an Induction has been created`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('retrieveGoals')
    cy.task('retrieveGoals500')
  })

  it('should display the Create Goal page given the prisoner does not have an Action Plan with goals', () => {
    // Given
    const prisonNumber = 'A00001A'
    cy.signIn()
    cy.task('getActionPlan', prisonNumber) // The Action Plan returned from the API for prisoner A00001A has no goals
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })

    // When
    cy.visit(`/plan/${prisonNumber}/induction-created`)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })

  it('should display the Overview page given the prisoner already has an Action Plan with goals', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.task('retrieveGoals', {
      status: GoalStatusValue.ACTIVE,
      goals: [aValidGoalResponse()],
    })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })

    // When
    cy.visit(`/plan/${prisonNumber}/induction-created`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .hasGoalsDisplayed()
  })

  it('should display the Overview page given retrieving the prisoners Action Plan fails', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })
    cy.task('retrieveGoals500', { goals: [], problemRetrievingData: true })

    // When
    cy.visit(`/plan/${prisonNumber}/induction-created`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .hasServiceUnavailableMessageDisplayed() // because retrieving the action plan returned a 500
  })
})
