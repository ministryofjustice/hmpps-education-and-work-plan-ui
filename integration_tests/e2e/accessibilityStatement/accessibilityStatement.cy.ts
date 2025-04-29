import AccessibilityStatementPage from '../../pages/accessibilityStatement/accessibilityStatementPage'
import Page from '../../pages/page'

context('Accessibility statement', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('should render accessibility statement page given the user has no roles', () => {
    // Given
    cy.task('stubSignIn')

    cy.signIn()

    // When
    cy.visit('/accessibility-statement')

    // Then
    Page.verifyOnPage(AccessibilityStatementPage)
  })
})
