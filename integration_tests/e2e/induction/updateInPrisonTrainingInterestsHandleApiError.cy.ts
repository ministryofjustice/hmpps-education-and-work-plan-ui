import Page from '../../pages/page'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'

context('Update in-prison training interests within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay In Prison Training Interests page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    const inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)

    // When
    inPrisonTrainingPage //
      .apiErrorBannerIsNotDisplayed()
      .selectInPrisonTraining(InPrisonTrainingValue.CATERING)
      .submitPage()

    // Then
    Page.verifyOnPage(InPrisonTrainingPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay In Prison Training Interests page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    const inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)

    // When
    inPrisonTrainingPage //
      .apiErrorBannerIsNotDisplayed()
      .selectInPrisonTraining(InPrisonTrainingValue.CATERING)
      .submitPage()

    // Then
    Page.verifyOnPage(InPrisonTrainingPage) //
      .apiErrorBannerIsDisplayed()
  })
})
