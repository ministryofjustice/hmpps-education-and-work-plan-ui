/**
 * Cypress tests that test the 'Go to learning and work progress plan' button on Review Complete page
 */
import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import ReviewCompletePage from '../../pages/reviewPlan/ReviewCompletePage'
import ReviewPlanCheckYourAnswersPage from '../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'

context(`Go to learning and work progress plan from review complete page`, () => {
  const prisonNumber = 'G6115VJ'
  beforeEach(() => {
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()
  })

  it('Should navigate to the overview page when Go to learning and work progress plan button on review complete page is clicked', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    // When
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage).submitPage()

    // Then
    Page.verifyOnPage(ReviewCompletePage).submitPage()
    Page.verifyOnPage(OverviewPage)
  })

  it(`should redirect to the 'Overview' page given user tries to navigate directly to 'Review Complete' page - ie. navigate out of sequence`, () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/complete`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })
})
