import Page from '../../pages/page'
import QualificationsListPage from '../../pages/prePrisonEducation/QualificationsListPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/prePrisonEducation/QualificationDetailsPage'

context('Update educational qualifications within a prisoners Education before the Induction has been created', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction404Error')
    cy.task('stubGetEducation')
    cy.task('stubUpdateEducation')
    cy.signIn()
  })

  it('should display the Qualifications List page given Curious is unavailable for both Functional Skills and In-Prison Courses & Qualifications', () => {
    // Given
    cy.task('stubLearnerAssessments500Error') // Functional Skills from come the Learner Assessments
    cy.task('stubLearnerQualifications500Error') // In-Prison Courses & Qualifications come from the Learner Qualifications

    const prisonNumber = 'G6115VJ'

    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()

    // When
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)

    // Then
    /* Education has highest level of education of SECONDARY_SCHOOL_TOOK_EXAMS with the following qualifications:
         Pottery, grade C, LEVEL_4, 814ade0a-a3b2-46a3-862f-79211ba13f7b
    */
    qualificationsListPage //
      .hasEducationalQualifications(['Pottery'])
      .hasFunctionalSkillsCuriousUnavailableMessageDisplayed()
      .hasInPrisonCoursesCuriousUnavailableMessageDisplayed()
  })

  it('should update Education and redirect back to Education & Training page given Qualifications List page is submitted without having made any changes', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    /* Education has highest level of education of SECONDARY_SCHOOL_TOOK_EXAMS with the following qualifications:
         Pottery, grade C, LEVEL_4, 814ade0a-a3b2-46a3-862f-79211ba13f7b
    */

    qualificationsListPage //
      .hasEducationalQualifications(['Pottery'])

    // When
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.educationLevel == 'SECONDARY_SCHOOL_TOOK_EXAMS' && " +
              '@.qualifications.size() == 1 && ' +
              "@.qualifications[0].reference == '814ade0a-a3b2-46a3-862f-79211ba13f7b' && " +
              "@.qualifications[0].subject == 'Pottery' && " +
              "@.qualifications[0].grade == 'C' && " +
              "@.qualifications[0].level == 'LEVEL_4')]",
          ),
        ),
    )
  })

  it('should remove all qualifications and call API to update Education', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)

    /* Education has highest level of education of SECONDARY_SCHOOL_TOOK_EXAMS with the following qualifications:
         Pottery, grade C, LEVEL_4, 814ade0a-a3b2-46a3-862f-79211ba13f7b
    */

    qualificationsListPage //
      .hasEducationalQualifications(['Pottery'])

    // When
    qualificationsListPage //
      .removeQualification(1) // Remove Level 4 Pottery
    qualificationsListPage.hasNoEducationalQualificationsDisplayed()
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.educationLevel == 'SECONDARY_SCHOOL_TOOK_EXAMS' && " + //
              '@.qualifications.size() == 0)]',
          ),
        ),
    )
  })

  it('should add qualification and redirect back to Education and Qualifications page given no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()

    /* Education has highest level of education of SECONDARY_SCHOOL_TOOK_EXAMS with the following qualifications:
     Pottery, grade C, LEVEL_4, 814ade0a-a3b2-46a3-862f-79211ba13f7b
    */
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage //
      .hasEducationalQualifications(['Pottery'])
      .clickToAddAnotherQualification()

    const qualificationLevelPage = Page.verifyOnPage(QualificationLevelPage)
    qualificationLevelPage //
      .selectQualificationLevel(QualificationLevelValue.LEVEL_3)
      .submitPage()

    const qualificationDetailsPage = Page.verifyOnPage(QualificationDetailsPage)
    qualificationDetailsPage //
      .setQualificationSubject('Spanish')
      .setQualificationGrade('B')
      .submitPage()

    const expectedQualifications = ['Pottery', 'Spanish']
    Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.hasEducationalQualifications(expectedQualifications)

    // When
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.educationLevel == 'SECONDARY_SCHOOL_TOOK_EXAMS' && " +
              '@.qualifications.size() == 2 && ' +
              "@.qualifications[0].reference == '814ade0a-a3b2-46a3-862f-79211ba13f7b' && " +
              "@.qualifications[0].subject == 'Pottery' && " +
              "@.qualifications[0].grade == 'C' && " +
              "@.qualifications[0].level == 'LEVEL_4' && " +
              '!@.qualifications[1].reference && ' + // assert the qualification has no reference as it is a new qualification that wont have a reference until the API has created it
              "@.qualifications[1].subject == 'Spanish' && " +
              "@.qualifications[1].grade == 'B' && " +
              "@.qualifications[1].level == 'LEVEL_3')]",
          ),
        ),
    )
  })

  it('should not add qualification given validation errors on qualification level page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)
    qualificationsListPage.clickToAddAnotherQualification()
    const qualificationLevelPage = Page.verifyOnPage(QualificationLevelPage)

    // When
    qualificationLevelPage.submitPage()

    // Then
    Page.verifyOnPage(QualificationLevelPage)
    qualificationLevelPage //
      .hasFieldInError('qualificationLevel')
  })

  it('should not add qualification given validation errors on qualification details page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .clickToChangeEducationalQualifications()
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
  })
})
