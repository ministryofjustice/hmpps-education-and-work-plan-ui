import Page from '../../pages/page'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'

context('Update previous work experience types within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Previous Work Experience Types page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

    // When
    previousWorkExperienceTypesPage //
      .apiErrorBannerIsNotDisplayed()
      .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()

    // Then
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Previous Work Experience Types page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)

    // When
    previousWorkExperienceTypesPage //
      .apiErrorBannerIsNotDisplayed()
      .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()

    // Then
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .apiErrorBannerIsDisplayed()
  })
})
