import Page from '../../pages/page'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'

context('Update future work interest types within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Future Work Interest Types page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    const futureWorkInterestTypesPage = Page.verifyOnPage(FutureWorkInterestTypesPage)

    // When
    futureWorkInterestTypesPage //
      .apiErrorBannerIsNotDisplayed()
      .selectWorkInterestType(WorkInterestTypeValue.WASTE_MANAGEMENT)
      .submitPage()

    // Then
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Future Work Interest Types page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    const futureWorkInterestTypesPage = Page.verifyOnPage(FutureWorkInterestTypesPage)

    // When
    futureWorkInterestTypesPage //
      .apiErrorBannerIsNotDisplayed()
      .selectWorkInterestType(WorkInterestTypeValue.WASTE_MANAGEMENT)
      .submitPage()

    // Then
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .apiErrorBannerIsDisplayed()
  })
})
