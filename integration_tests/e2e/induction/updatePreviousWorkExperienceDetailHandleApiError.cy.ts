import Page from '../../pages/page'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'

context('Update previous work experience detail within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Previous Work Experience Detail page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/office`)
    const previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)

    // When
    previousWorkExperienceDetailPage //
      .apiErrorBannerIsNotDisplayed()
      .setJobRole('Office manager')
      .setJobDetails('Managing a busy office with staff responsibility for 5 interns')
      .submitPage()

    // Then
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Previous Work Experience Detail page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/office`)
    const previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)

    // When
    previousWorkExperienceDetailPage //
      .apiErrorBannerIsNotDisplayed()
      .setJobRole('Office manager')
      .setJobDetails('Managing a busy office with staff responsibility for 5 interns')
      .submitPage()

    // Then
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .apiErrorBannerIsDisplayed()
  })
})
