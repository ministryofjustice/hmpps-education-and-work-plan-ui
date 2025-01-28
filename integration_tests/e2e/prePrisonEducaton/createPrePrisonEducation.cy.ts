import Page from '../../pages/page'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import OverviewPage from '../../pages/overview/OverviewPage'
import QualificationDetailsPage from '../../pages/prePrisonEducation/QualificationDetailsPage'
import QualificationsListPage from '../../pages/prePrisonEducation/QualificationsListPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Create a prisoners pre-prison education', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInduction404Error')
    cy.task('stubGetEducation404Error')
    cy.task('stubCreateEducation')
  })

  it('should be able to navigate directly to Highest Level of Education page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)

    // Then
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
  })

  it('should redirect to Overview page given user navigates directly to Qualification Level page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/create-education/qualification-level`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it('should redirect to Overview page given user navigates directly to Qualification Details page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/create-education/qualification-details`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it('should redirect to Qualification Level page given user starts flow but tries to navigate to Qualification Details page without going to Qualification Level first', () => {
    // Given
    cy.signIn()

    cy.visit(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)

    // When
    // User tries to navigate to Qualifications Details page without submitting Highest Level of Education (which would take the user to Qualification Level)
    cy.visit(`/prisoners/${prisonNumber}/create-education/qualification-details`)

    // Then
    Page.verifyOnPage(QualificationLevelPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should create a prisoners education record, triggering validation on every screen', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.selectTab('Education and training')
    const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)
    educationAndTrainingPage.clickToAddEducationHistory()

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
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)
      .hasErrorCount(1)
      .hasFieldInError('qualificationLevel')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_2)
      .submitPage()

    // Qualification Details is the next page
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-education/qualification-level`)
      .setQualificationGrade('C')
      .submitPage() // submit the page without answering the Qualification Subject question to trigger a validation error
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-education/qualification-level`)
      .hasErrorCount(1)
      .hasFieldInError('qualificationSubject')
      .setQualificationSubject('GCSE Maths')
      .submitPage()

    // Qualifications List is the next page
    Page.verifyOnPage(QualificationsListPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)
      .hasEducationalQualifications(['GCSE Maths'])
      .clickToAddAnotherQualification()

    // Qualification Level is the next page
    Page.verifyOnPage(QualificationLevelPage).selectQualificationLevel(QualificationLevelValue.LEVEL_3).submitPage()
    // Qualification Details is the next page
    Page.verifyOnPage(QualificationDetailsPage)
      .setQualificationGrade('B')
      .setQualificationSubject('A Level English')
      .submitPage()

    // Qualifications List is the next page
    Page.verifyOnPage(QualificationsListPage).clickToAddAnotherQualification()

    // Qualification Level is the next page
    Page.verifyOnPage(QualificationLevelPage).selectQualificationLevel(QualificationLevelValue.LEVEL_2).submitPage()
    // Qualification Details is the next page
    Page.verifyOnPage(QualificationDetailsPage)
      .setQualificationGrade('C')
      .setQualificationSubject('GCSE Pottery')
      .submitPage()

    // Qualifications List is the next page
    Page.verifyOnPage(QualificationsListPage)
      .hasEducationalQualifications(['GCSE Maths', 'A Level English', 'GCSE Pottery'])
      .removeQualification(1) // remove GCSE Maths
      .hasEducationalQualifications(['A Level English', 'GCSE Pottery'])
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.prisonId == 'BXI' && " +
              "@.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.qualifications.size() == 2 && ' +
              '!@.qualifications[0].reference && ' + // assert the qualification has no reference as it is a new qualification that wont have a reference until the API has created it
              "@.qualifications[0].subject == 'A Level English' && " +
              "@.qualifications[0].grade == 'B' && " +
              "@.qualifications[0].level == 'LEVEL_3' && " +
              '!@.qualifications[1].reference && ' + // assert the qualification has no reference as it is a new qualification that wont have a reference until the API has created it
              "@.qualifications[1].subject == 'GCSE Pottery' && " +
              "@.qualifications[1].grade == 'C' && " +
              "@.qualifications[1].level == 'LEVEL_2')]",
          ),
        ),
    )
  })
})
