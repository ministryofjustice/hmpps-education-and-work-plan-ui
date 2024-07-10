import Page from '../../pages/page'
import AuthorisationErrorPage from '../../pages/authorisationError'
import Error404Page from '../../pages/error404'

context('Security tests for creating and updating Inductions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  describe('Creating Inductions', () => {
    it('should redirect to auth-error page given user does not have any authorities', () => {
      // Given
      cy.task('stubSignIn')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/create-induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })

    it('should redirect to auth-error page given user does not have edit authority', () => {
      // Given
      cy.task('stubSignInAsUserWithViewAuthority')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/create-induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe('Updating Inductions', () => {
    it('should redirect to 404 page given prisoner does not have an induction', () => {
      // Given
      cy.task('stubGetInduction404Error')
      cy.signIn()
      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(Error404Page)
    })

    it('should redirect to auth-error page given user does not have any authorities', () => {
      // Given
      cy.task('stubSignIn')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })

    it('should redirect to auth-error page given user does not have edit authority', () => {
      // Given
      cy.task('stubSignInAsUserWithViewAuthority')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })
})
