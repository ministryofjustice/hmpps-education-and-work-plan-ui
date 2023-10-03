import Page from '../../pages/page'
import UpdateGoalPage from '../../pages/goal/UpdateGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import ReviewUpdateGoalPage from '../../pages/goal/ReviewUpdateGoalPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import { UpdateGoalRequest } from '../../mockApis/educationAndWorkPlanApi'
import Error404Page from '../../pages/error404'
import Error500Page from '../../pages/error500'

context('Update a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
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
      .setTargetCompletionDateFromValuePreviouslySaveInGoal()
      .submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should not submit the form and highlight field in error if there are validation errors on target completion date field', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()

    // When
    updateGoalPage //
      .setTargetCompletionDate('01', '91', 'xx91')
      .submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('targetCompletionDate')
      .hasTargetCompletionDateValue('01', '91', 'xx91')
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
      .setTargetCompletionDateFromValuePreviouslySaveInGoal()
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
      .submitPage()

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
      })
  })

  it('should be able to remove a step as part of updating a goal', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()

    // When
    updateGoalPage //
      .clickRemoveButtonForSecondStep()
      .submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
    // Assert that the expected step was removed from the UpdateGoal request to the API - TODO, there has to be a better way of doing this
    cy.task<UpdateGoalRequest>('getUpdateGoalRequestBody')
      .then(updateGoalRequestBody => {
        const { steps } = updateGoalRequestBody
        return steps
      })
      .should('have.length', 1)
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

  it(`should render 404 page given specified goal is not found in the prisoner's plan`, () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const nonExistentGoalReference = 'c17ffa15-cf3e-409b-827d-e1e458dbd5e8'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${nonExistentGoalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it(`should render 500 page given error retrieving prisoner's plan`, () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.task('getActionPlan500Error')

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error500Page)
  })
})
