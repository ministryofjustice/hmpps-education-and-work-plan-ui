import Page from '../../pages/page'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update educational qualifications within an Induction - add new qualification', () => {
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
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should add qualification and redirect back to Education and Qualifications page given no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.clickToAddAnotherQualification()

    const qualificationLevelPage = Page.verifyOnPage(QualificationLevelPage)
    qualificationLevelPage //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualifications`)
      .selectQualificationLevel(QualificationLevelValue.LEVEL_3)
      .submitPage()

    const qualificationDetailsPage = Page.verifyOnPage(QualificationDetailsPage)
    qualificationDetailsPage //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualification-level`)
      .setQualificationSubject('Spanish')
      .setQualificationGrade('B')
      .submitPage()

    /* Induction has the following qualifications:
         French, grade C, LEVEL_3
         Maths, grade A, level LEVEL_3
         Maths, grade 1st, level LEVEL_6
         English, grade A, level LEVEL_3
    */
    const expectedQualifications = ['French', 'Maths', 'Maths', 'English', 'Spanish']
    Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.hasEducationalQualifications(expectedQualifications)

    // When
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' && " +
              '@.previousQualifications.qualifications.size() == 5 && ' +
              "@.previousQualifications.qualifications[0].subject == 'French' && " +
              "@.previousQualifications.qualifications[0].grade == 'C' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_3' && " +
              "@.previousQualifications.qualifications[1].subject == 'Maths' && " +
              "@.previousQualifications.qualifications[1].grade == 'A' && " +
              "@.previousQualifications.qualifications[1].level == 'LEVEL_3' && " +
              "@.previousQualifications.qualifications[2].subject == 'Maths' && " +
              "@.previousQualifications.qualifications[2].grade == '1st' && " +
              "@.previousQualifications.qualifications[2].level == 'LEVEL_6' && " +
              "@.previousQualifications.qualifications[3].subject == 'English' && " +
              "@.previousQualifications.qualifications[3].grade == 'A' && " +
              "@.previousQualifications.qualifications[3].level == 'LEVEL_3' && " +
              "@.previousQualifications.qualifications[4].subject == 'Spanish' && " +
              "@.previousQualifications.qualifications[4].grade == 'B' && " +
              "@.previousQualifications.qualifications[4].level == 'LEVEL_3')]",
          ),
        ),
    )
  })

  it('should not add qualification given validation errors on qualification level page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.clickToAddAnotherQualification()
    const qualificationLevelPage = Page.verifyOnPage(QualificationLevelPage)

    // When
    qualificationLevelPage.submitPage()

    // Then
    Page.verifyOnPage(QualificationLevelPage)
    qualificationLevelPage //
      .hasFieldInError('qualificationLevel')
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualifications`)
  })

  it('should not add qualification given validation errors on qualification details page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.clickToAddAnotherQualification()
    const qualificationLevelPage = Page.verifyOnPage(QualificationLevelPage)
    qualificationLevelPage //
      .selectQualificationLevel(QualificationLevelValue.LEVEL_3)
      .submitPage()

    const qualificationDetailsPage = Page.verifyOnPage(QualificationDetailsPage)
    qualificationDetailsPage //
      .setQualificationSubject('Spanish')
      .clearQualificationGrade()

    // When
    qualificationDetailsPage.submitPage()

    // Then
    Page.verifyOnPage(QualificationDetailsPage)
    qualificationDetailsPage //
      .hasFieldInError('qualificationGrade')
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualification-level`)
  })
})
