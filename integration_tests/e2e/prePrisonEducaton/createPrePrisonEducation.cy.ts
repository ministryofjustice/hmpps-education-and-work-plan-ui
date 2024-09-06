import Page from '../../pages/page'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import OverviewPage from '../../pages/overview/OverviewPage'

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

  it('should redirect Overview page given user navigates directly to Qualification Level page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/qualification-level`)

    // Then
    Page.verifyOnPage(OverviewPage)
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

  it('should create a prisoners education record, triggering validation on every screen', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/prisoners/${prisonNumber}/highest-level-of-education`)

    // When
    // First page is Highest Level of Education
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
      .hasErrorCount(1)
      .hasFieldInError('educationLevel')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Qualification Level is the next page
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/highest-level-of-education`)
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/highest-level-of-education`)
      .hasErrorCount(1)
      .hasFieldInError('qualificationLevel')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_3)
    // .submitPage() // TODO submit the page when the Qualification Details page is implemented

    // Then
    // TODO - verify API was called with the expected data
  })
})
