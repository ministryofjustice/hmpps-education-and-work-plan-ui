import { startOfToday } from 'date-fns'
import Page from '../../pages/page'
import WhoCompletedReviewPage from '../../pages/reviewPlan/WhoCompletedReviewPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import ReviewPlanCompletedByValue from '../../../server/enums/reviewPlanCompletedByValue'

context(`Review a prisoner's plan`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetAllPrisons')
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
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
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/overview`)
  })

  it(`should complete a prisoner's review, triggering validation on every screen`, () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review`)

    const today = startOfToday()

    // When
    // First page is the Who completed the review page
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/overview`)
      .submitPage() // submit the page without answering any questions to trigger a validation error
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasErrorCount(2)
      .hasFieldInError('completedBy')
      .hasFieldInError('review-date')
      .setReviewDate(`${today.getDate()}`, `${today.getMonth() + 1}`, `${today.getFullYear()}`)
      .selectWhoCompletedTheReview(ReviewPlanCompletedByValue.SOMEBODY_ELSE)
      .submitPage()
    Page.verifyOnPage(WhoCompletedReviewPage) //
      .hasErrorCount(1)
      .hasFieldInError('completedByOther')
      .enterReviewersName('A Reviewer')
    // .submitPage()

    // Then
    // TODO - assert API was called with correct valyes
  })
})
