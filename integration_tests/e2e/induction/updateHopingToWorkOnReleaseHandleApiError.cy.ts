import Page from '../../pages/page'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'

context('Update Hoping to work on release within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Hoping To Work On Release page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage)

    // When
    hopingToWorkOnReleasePage //
      .apiErrorBannerIsNotDisplayed()
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Then
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Hoping To Work On Release page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage)

    // When
    hopingToWorkOnReleasePage //
      .apiErrorBannerIsNotDisplayed()
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Then
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .apiErrorBannerIsDisplayed()
  })
})
