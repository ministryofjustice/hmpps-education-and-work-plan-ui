/**
 * Cypress tests that test the Change links on the Check Your Answers page for Review Plan
 */
import Page from '../../pages/page'
import ReviewNotePage from '../../pages/reviewPlan/ReviewNotePage'
import ReviewPlanCheckYourAnswersPage from '../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import WhoCompletedReviewPage from '../../pages/reviewPlan/WhoCompletedReviewPage'

context(`Change links on the Check Your Answers page when creating a review`, () => {
  beforeEach(() => {
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()
  })

  it('Should support the change link to change who added the review on the Check Your Answers page when creating a review', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    // When
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage).clickReviewCompletedByChangeLink()

    // Then
    Page.verifyOnPage(WhoCompletedReviewPage).hasCorrectBackLink()
  })

  it('Should support the change link to change the note on the Check Your Answers page when creating a review', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    // When
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage).clickReviewNoteChangeLink()

    // Then
    Page.verifyOnPage(ReviewNotePage).hasCorrectBackLink()
  })
})
