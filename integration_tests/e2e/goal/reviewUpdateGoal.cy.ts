import Page from '../../pages/page'
import UpdateGoalPage from '../../pages/goal/UpdateGoalPage'
import ReviewUpdateGoalPage from '../../pages/goal/ReviewUpdateGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import Error500Page from '../../pages/error500'

context('Review updated goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('updateGoal')
  })

  it('should not be able to navigate directly to Review Goal given previous forms have not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update/review`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(prisonNumber)
  })

  it(`should navigate back to the update goal form when the 'go back to edit goal' button is clicked`, () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()
    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.isForPrisoner(prisonNumber)

    // When
    reviewUpdateGoalPage.goBackToEditGoal()

    // Then
    Page.verifyOnPage(UpdateGoalPage).isForGoal(goalReference)
  })

  it('should be able to submit the form if no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()
    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.isForPrisoner(prisonNumber)

    // When
    reviewUpdateGoalPage.submitPage()

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
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update/review`, { failOnStatusCode: false })

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
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/update/review`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it(`should render 500 page given error updating prisoner's plan`, () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.task('updateGoal500Error')

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const updateGoalPage = overviewPage.clickUpdateButtonForFirstGoal()
    updateGoalPage.isForGoal(goalReference).submitPage()

    const reviewUpdateGoalPage = Page.verifyOnPage(ReviewUpdateGoalPage)
    reviewUpdateGoalPage.isForPrisoner(prisonNumber)

    // When
    reviewUpdateGoalPage.submitPage()

    // Then
    Page.verifyOnPage(Error500Page)
  })
})
