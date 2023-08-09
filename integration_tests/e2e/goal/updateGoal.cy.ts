import Page from '../../pages/page'
import UpdateGoalPage from '../../pages/goal/UpdateGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import ReviewUpdateGoalPage from '../../pages/goal/ReviewUpdateGoalPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import { UpdateGoalRequest } from '../../mockApis/educationAndWorkPlanApi'

context('Update a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('stubLearnerProfile')
    cy.task('updateGoal')
  })

  it('should be able to navigate directly to update goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`)

    // Then
    const updateGoalPage = Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage.isForGoal(goalReference)
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()

    // When
    updateGoalPage //
      .clearGoalTitle()
      .submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should be able to submit the form if no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()

    // When
    updateGoalPage //
      .setGoalTitle('Learn French')
      .setFirstStepTitle('Obtain a French dictionary')
      .submitPage()

    // Then
    Page.verifyOnPage(ReviewUpdateGoalPage)
  })

  it('should be able to add a new step as part of updating a goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()

    // When
    updateGoalPage //
      // The goal loaded from the wiremock stub data has 2 steps. After adding another step, the new step will be referenced as step 3
      .addAnotherStep()
      .setStepTitle(3, 'A brand new step')
      .setStepStatus(3, 'Started')
      .setStepTargetDateRange(3, '6 to 12 months')
      .submitPage()

    // Then
    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
    // Assert that the expected new step was sent in the UpdateGoal request to the API - TODO, there has to be a better way of doing this
    cy.task<UpdateGoalRequest>('getUpdateGoalRequestBody')
      .then(updateGoalRequestBody => {
        const newStep = { ...updateGoalRequestBody.steps.slice(-1)[0] }
        return newStep
      })
      .should('deep.equal', {
        stepReference: '',
        sequenceNumber: '3',
        title: 'A brand new step',
        status: 'ACTIVE',
        targetDateRange: 'SIX_TO_TWELVE_MONTHS',
      })
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')

    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
