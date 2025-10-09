import Page from '../../pages/page'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'

context('Update future work interest roles within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Future Work Interest Roles page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-roles`)
    const futureWorkInterestRolesPage = Page.verifyOnPage(FutureWorkInterestRolesPage)

    // When
    futureWorkInterestRolesPage //
      .apiErrorBannerIsNotDisplayed()
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Solar panel installer')
      .submitPage()

    // Then
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Future Work Interest Roles page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-roles`)
    const futureWorkInterestRolesPage = Page.verifyOnPage(FutureWorkInterestRolesPage)

    // When
    futureWorkInterestRolesPage //
      .apiErrorBannerIsNotDisplayed()
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Solar panel installer')
      .submitPage()

    // Then
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .apiErrorBannerIsDisplayed()
  })
})
