import Page from '../../pages/page'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'

context('Update personal interests within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Personal Interests page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    const personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)

    // When
    personalInterestsPage //
      .apiErrorBannerIsNotDisplayed()
      .selectPersonalInterest(PersonalInterestsValue.SOCIAL)
      .submitPage()

    // Then
    Page.verifyOnPage(PersonalInterestsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Personal Interests page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    const personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)

    // When
    personalInterestsPage //
      .apiErrorBannerIsNotDisplayed()
      .selectPersonalInterest(PersonalInterestsValue.SOCIAL)
      .submitPage()

    // Then
    Page.verifyOnPage(PersonalInterestsPage) //
      .apiErrorBannerIsDisplayed()
  })
})
