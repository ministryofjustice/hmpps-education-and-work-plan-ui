import Page from '../../pages/page'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Create a prisoners pre-prison education', () => {
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
  })

  it('should be able to navigate directly to Highest Level of Education page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/highest-level-of-education`)

    // Then
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.signIn()

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/prisoners/${prisonNumber}/highest-level-of-education`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should not be able to submit Highest Level of Education page given validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/prisoners/${prisonNumber}/highest-level-of-education`)
    const highestLevelOfEducationPage = Page.verifyOnPage(HighestLevelOfEducationPage)

    // When
    highestLevelOfEducationPage //
      .submitPage() // submit the page without answering the question

    // Then
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
      .hasFieldInError('educationLevel')
  })
})
