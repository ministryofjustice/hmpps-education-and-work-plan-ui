import Page from '../pages/page'
import Error404Page from '../pages/error404'
import AuthorisationErrorPage from '../pages/authorisationError'

context('404 Page Not Found', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubAuthUser')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview/unknown`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect the 404 page when an authenticated user navigates to a non-existent page', () => {
    // Given
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview/unknown`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
