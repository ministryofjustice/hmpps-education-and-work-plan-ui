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

context(`Show the relevant screen after an Induction has been created`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should display the Create Goal page given the prisoner does not have an Action Plan with goals', () => {
    // Given
    cy.signIn()
    cy.task('getActionPlan404Error')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })

    // When
    cy.visit(`/plan/${prisonNumber}/induction-created`)

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })

  it('should display the Overview page given the prisoner already has an Action Plan with goals', () => {
    // Given
    cy.signIn()
    cy.task('getGoalsByStatus', { prisonNumber })
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })
    cy.task('getActionPlan')

    // When
    cy.visit(`/plan/${prisonNumber}/induction-created`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
  })

  it('should display the Overview page given retrieving the prisoners Action Plan fails', () => {
    // Given
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction', { prisonNumber })
    cy.task('getActionPlan500Error')

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
