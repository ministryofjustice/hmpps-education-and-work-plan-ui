import Page from '../../pages/page'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'

context('Update additional training within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Additional Training page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    const additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)

    // When
    additionalTrainingPage //
      .selectAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .apiErrorBannerIsNotDisplayed()
      .submitPage()

    // Then
    Page.verifyOnPage(AdditionalTrainingPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Additional Training page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    const additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)

    // When
    additionalTrainingPage //
      .selectAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .apiErrorBannerIsNotDisplayed()
      .submitPage()

    // Then
    Page.verifyOnPage(AdditionalTrainingPage) //
      .apiErrorBannerIsDisplayed()
  })
})
