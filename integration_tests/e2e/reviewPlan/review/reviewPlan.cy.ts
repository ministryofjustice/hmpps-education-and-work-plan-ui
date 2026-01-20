import { startOfToday, sub } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import Page from '../../../pages/page'
import WhoCompletedReviewPage from '../../../pages/reviewPlan/WhoCompletedReviewPage'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import SessionCompletedByValue from '../../../../server/enums/sessionCompletedByValue'
import ReviewNotePage from '../../../pages/reviewPlan/ReviewNotePage'
import OverviewPage from '../../../pages/overview/OverviewPage'
import ReviewPlanCheckYourAnswersPage from '../../../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import ReviewCompletePage from '../../../pages/reviewPlan/ReviewCompletePage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'

context(`Review a prisoner's plan`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetActionPlanReviews')
    cy.task('stubCreateActionPlanReview')
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should be able to navigate directly to Review Plan page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review`)

    // Then
    Page.verifyOnPage(WhoCompletedReviewPage)
  })

  it('should redirect to overview page given user tries to navigate directly to Review Notes screen - ie. navigate out of sequence', () => {
    // Given
    cy.signIn()
    const nonExistentJourneyId = uuidV4()

    // When
    cy.visit(`/plan/${prisonNumber}/${nonExistentJourneyId}/review/notes`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it(`should complete a prisoner's review, triggering validation on every screen`, () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review`)

    const reviewConductedAt = sub(startOfToday(), { weeks: 1 })
    const reviewConductedAtDay = `${reviewConductedAt.getDate()}`.padStart(2, '0')
    const reviewConductedAtMonth = `${reviewConductedAt.getMonth() + 1}`.padStart(2, '0')
    const reviewConductedAtYear = `${reviewConductedAt.getFullYear()}`

    // When
    // First page is the Who completed the review page
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .submitPage() // submit the page without answering any questions to trigger a validation error
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasErrorCount(2)
      .hasFieldInError('completedBy')
      .hasFieldInError('reviewDate')
      .setReviewDate(reviewConductedAt)
      .selectWhoCompletedTheReview(SessionCompletedByValue.SOMEBODY_ELSE)
      .submitPage()
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasErrorCount(2)
      .hasFieldInError('completedByOtherFullName')
      .hasFieldInError('completedByOtherJobRole')
      .enterReviewersFullName('A Reviewer')
      .enterReviewersJobRole('CIAG')
      .submitPage()

    // Next page is Review Notes page
    Page.verifyOnPage(ReviewNotePage) //
      .submitPage() // submit the page without answering any questions to trigger a validation error
    Page.verifyOnPage(ReviewNotePage) //
      .hasErrorCount(1)
      .hasFieldInError('notes')
      .setReviewNote(
        `Edfdau's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Edfdau well and is allowing him to focus on more productive uses of his time whilst in prison.

We have agreed and set a new goal, and the next review is 1 year from now.
`,
      )
      .submitPage()

    // Next page is Review Check Your Answers page
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .reviewWasCompletedBySomebodyElse('A Reviewer')
      .reviewWasCompletedBySomebodyElseWithJobRole('CIAG')
      .hasNotes(
        `Edfdau's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Edfdau well and is allowing him to focus on more productive uses of his time whilst in prison.

We have agreed and set a new goal, and the next review is 1 year from now.
`,
      )
      .submitPage()

    // Next page is Review Completed page
    Page.verifyOnPage(ReviewCompletePage) //
      .hasNextReviewDueMessage(`Edfdau Carrer's next review is due between 14 March 2025 and 14 April 2025.`) // Date values come from the stub `stubCreateActionPlanReview`
      .submitPage()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Review completed.')
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/reviews`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.prisonId == 'BXI' && " +
              `@.note == "Edfdau's review went well and he has made good progress on his goals.\nWorking in the prison kitchen is suiting Edfdau well and is allowing him to focus on more productive uses of his time whilst in prison.\n\nWe have agreed and set a new goal, and the next review is 1 year from now.\n" && ` +
              `@.conductedAt == '${reviewConductedAtYear}-${reviewConductedAtMonth}-${reviewConductedAtDay}' && ` +
              "@.conductedBy == 'A Reviewer' && " +
              "@.conductedByRole == 'CIAG')]",
          ),
        ),
    )
  })

  it(`should not complete a prisoner's review and redisplay Check Your Answers page given calling API is not successful`, () => {
    // Given
    cy.task('stubCreateActionPlanReview500Error')

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review`)

    const reviewConductedAt = sub(startOfToday(), { weeks: 1 })

    // When
    // First page is the Who completed the review page
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .setReviewDate(reviewConductedAt)
      .selectWhoCompletedTheReview(SessionCompletedByValue.SOMEBODY_ELSE)
      .enterReviewersFullName('A Reviewer')
      .enterReviewersJobRole('CIAG')
      .submitPage()

    // Next page is Review Notes page
    Page.verifyOnPage(ReviewNotePage) //
      .setReviewNote(`Edfdau's review went well`)
      .submitPage()

    // Next page is Review Check Your Answers page
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
      .submitPage()

    // Then
    Page.verifyOnPage(ReviewPlanCheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })
})
