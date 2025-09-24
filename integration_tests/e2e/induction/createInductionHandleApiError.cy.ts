import Page from '../../pages/page'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'

context('Create an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
  })

  it('should redisplay Check Your Answers page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubCreateInduction400Error', prisonNumber)

    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber })

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Check Your Answers page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubCreateInduction500Error', prisonNumber)

    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber })

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsNotDisplayed()
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .apiErrorBannerIsDisplayed()
  })
})
