import Page from '../pages/page'
import Error404Page from '../pages/error404'
import AuthSignInPage from '../pages/authSignIn'

context('404 Page Not Found', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
  })

  it('should redirect to auth sign-in page given unauthenticated user', () => {
    // Given
    cy.signOut()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthSignInPage)
  })

  it('should redirect to 404 page when user with PLP roles navigates to a non-existent prisoner page', () => {
    // Given
    const nonExistentPrisonNumber = 'A9999ZZ'
    cy.task('stubPrisonerById404Error')

    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/plan/${nonExistentPrisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should redirect to 404 page when user with PLP roles navigates to a non-existent page', () => {
    // Given
    cy.task('stubSignInAsUserWithContributorRole')
    cy.signIn()

    // When
    cy.visit(`/some-non-existent-page`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
