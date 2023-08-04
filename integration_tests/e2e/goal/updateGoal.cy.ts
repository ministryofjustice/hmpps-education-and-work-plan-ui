import Page from '../../pages/page'
import UpdateGoalPage from '../../pages/goal/UpdateGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Update a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('stubLearnerProfile')
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`)
    const updateGoalPage = Page.verifyOnPage(UpdateGoalPage)

    updateGoalPage //
      .isForGoal(goalReference)
      .clearGoalTitle()

    // When
    updateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(UpdateGoalPage)
    updateGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should be able to submit the form if no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update`)
    const updateGoalPage = Page.verifyOnPage(UpdateGoalPage)

    // When
    updateGoalPage //
      .isForGoal(goalReference)
      .setGoalTitle('Learn French')
      .setFirstStepTitle('Obtain a French dictionary')
      .submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
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
