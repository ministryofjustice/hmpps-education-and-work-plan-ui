import Page from '../../pages/page'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import OverviewPage from '../../pages/overview/OverviewPage'
import QualificationDetailsPage from '../../pages/prePrisonEducation/QualificationDetailsPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'

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

  it('should redirect to Overview page given user navigates directly to Qualification Level page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/qualification-level`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it('should redirect to Overview page given user navigates directly to Qualification Details page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/qualification-details`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it('should redirect to Qualification Level page given user starts flow but tries to navigate to Qualification Details page without going to Qualification Level first', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/prisoners/${prisonNumber}/highest-level-of-education`)
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)

    // When
    // User tries to navigate to Qualifications Details page without submitting Highest Level of Education (which would take the user to Qualification Level)
    cy.visit(`/prisoners/${prisonNumber}/qualification-details`)

    // Then
    Page.verifyOnPage(QualificationLevelPage)
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
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetInduction404Error', prisonNumber)

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.selectTab('Education and training')
    const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)
    educationAndTrainingPage.clickToAddEducationalQualifications(HighestLevelOfEducationPage)

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
      .submitPage()

    // Qualification Details is the next page
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/qualification-level`)
      .setQualificationGrade('C')
      .submitPage() // submit the page without answering the Qualification Subject question to trigger a validation error
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/qualification-level`)
      .hasErrorCount(1)
      .hasFieldInError('qualificationSubject')
      .setQualificationSubject('GCSE Maths')
    // .submitPage() // TODO submit the page when the Qualification Details page is implemented

    // Then
    // TODO - verify API was called with the expected data
  })
})
