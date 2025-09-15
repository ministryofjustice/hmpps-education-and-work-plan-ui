/**
 * Cypress tests that test the Change links on the Check Your Answers page for Review Plan
 */
import Page from '../../../pages/page'
import ReviewNotePage from '../../../pages/reviewPlan/ReviewNotePage'
import ReviewPlanCheckYourAnswersPage from '../../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import WhoCompletedReviewPage from '../../../pages/reviewPlan/WhoCompletedReviewPage'
import SessionCompletedByValue from '../../../../server/enums/sessionCompletedByValue'

context(`Change links on the Check Your Answers page when creating a review`, () => {
  beforeEach(() => {
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetActionPlanReviews')
    cy.signIn()
  })

  it('Should support the change link to change who added the review on the Check Your Answers page when creating a review', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .reviewWasCompletedBySomebodyElse('A Reviewer')
      .reviewWasCompletedBySomebodyElseWithJobRole('CIAG')
      .clickReviewCompletedByChangeLink()

    // When
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .selectWhoCompletedTheReview(SessionCompletedByValue.MYSELF)
      .submitPage()

    // Then
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .reviewWasCompletedByMyself()
  })

  it('Should support the change link to change the note on the Check Your Answers page when creating a review', () => {
    // Given
    cy.createReviewToArriveOnCheckYourAnswers()

    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .hasNotes(
        `Edfdau's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Edfdau well and is allowing him to focus on more productive uses of his time whilst in prison.

We have agreed and set a new goal, and the next review is 1 year from now.
`,
      )
      .clickReviewNoteChangeLink()

    // When
    Page.verifyOnPage(ReviewNotePage) //
      .setReviewNote('A shorter, more concise note!')
      .submitPage()

    // Then
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .hasNotes('A shorter, more concise note!')
  })
})
