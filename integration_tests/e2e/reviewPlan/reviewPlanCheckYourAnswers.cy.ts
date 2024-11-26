/**
 * Cypress tests that test the Change links on the Check Your Answers page for Review Plan
 */
import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import ReviewCompletePage from '../../pages/reviewPlan/ReviewCompletePage'
import ReviewNotePage from '../../pages/reviewPlan/ReviewNotePage'
import ReviewPlanCheckYourAnswersPage from '../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import WhoCompletedReviewPage from '../../pages/reviewPlan/WhoCompletedReviewPage'

context(`Change links on the Check Your Answers page when creating a review`, () => {
  const prisonNumber = 'G6115VJ'
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
    Page.verifyOnPage(WhoCompletedReviewPage)
  })

  it('Should support the change link to change the note on the Check Your Answers page when creating a review', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    // When
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage).clickReviewNoteChangeLink()

    // Then
    Page.verifyOnPage(ReviewNotePage)
  })

  it('Should redirect to Review Complete page when continue button is clicked', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    // When
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage).submitPage()

    // Then
    Page.verifyOnPage(ReviewCompletePage)
  })

  it('should redirect to overview page given user tries to navigate directly to Review Notes screen - ie. navigate out of sequence', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/notes`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })
})
