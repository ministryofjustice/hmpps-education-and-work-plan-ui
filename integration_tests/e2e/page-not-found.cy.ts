import Page from '../pages/page'
import Error404Page from '../pages/error404'
import AuthSignInPage from '../pages/authSignIn'

context('404 Page Not Found', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubAuthUser')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
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

  it('should redirect to 404 page given user does not have any authorities', () => {
    // Given
    const userRoles = []
    cy.task('stubSignIn', userRoles)
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should redirect to 404 page when user with PLP roles navigates to a non-existent page', () => {
    // Given
    const userRoles = ['ROLE_EDUCATION_AND_WORK_PLAN_EDITOR']
    cy.task('stubSignIn', userRoles)
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview/unknown`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
