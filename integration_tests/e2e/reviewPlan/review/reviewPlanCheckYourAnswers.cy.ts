/**
 * Cypress tests that test the Change links on the Check Your Answers page for Review Plan
 */
import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ReviewNotePage from '../../../pages/reviewPlan/ReviewNotePage'
import ReviewPlanCheckYourAnswersPage from '../../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import WhoCompletedReviewPage from '../../../pages/reviewPlan/WhoCompletedReviewPage'
import SessionCompletedByValue from '../../../../server/enums/sessionCompletedByValue'

context(`Change links on the Check Your Answers page when creating a review`, () => {
  const prisonNumber = 'G6115VJ'
  beforeEach(() => {
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubGetSessionSummary')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
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
        `Daniel's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Daniel well and is allowing him to focus on more productive uses of his time whilst in prison.

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

  it('should redirect to overview page given user tries to navigate directly to Review Notes screen - ie. navigate out of sequence', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/notes`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })
})
