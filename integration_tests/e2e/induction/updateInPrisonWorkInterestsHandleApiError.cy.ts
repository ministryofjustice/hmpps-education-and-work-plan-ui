import Page from '../../pages/page'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'

context('Update in-prison work interests within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay In Prison Work Interests page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
    const inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

    // When
    inPrisonWorkPage //
      .apiErrorBannerIsNotDisplayed()
      .selectWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .submitPage()

    // Then
    Page.verifyOnPage(InPrisonWorkPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay In Prison Work Interests page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
    const inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

    // When
    inPrisonWorkPage //
      .apiErrorBannerIsNotDisplayed()
      .selectWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .submitPage()

    // Then
    Page.verifyOnPage(InPrisonWorkPage) //
      .apiErrorBannerIsDisplayed()
  })
})
