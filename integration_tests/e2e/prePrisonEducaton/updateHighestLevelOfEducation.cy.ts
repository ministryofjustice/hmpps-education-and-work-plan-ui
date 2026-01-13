import Page from '../../pages/page'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'

context('Update highest level of education within a prisoners Education before the Induction has been created', () => {
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

  /* Prisoner's education record has highest level of education of SECONDARY_SCHOOL_TOOK_EXAMS
     with the following qualifications:
       Pottery, grade C, LEVEL_4
   */

  it('should update Education given form submitted with non exam level highest level of education', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    const highestLevelOfEducationPage =
      Page.verifyOnPage(EducationAndTrainingPage).clickToChangeHighestLevelOfEducation()

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              "@.reference == 'dea24acc-fde5-4ead-a9eb-e1757de2542c' && " +
              '@.qualifications.size() == 1 && ' +
              "@.qualifications[0].reference == '814ade0a-a3b2-46a3-862f-79211ba13f7b' && " +
              "@.qualifications[0].subject == 'Pottery' && " +
              "@.qualifications[0].grade == 'C' && " +
              "@.qualifications[0].level == 'LEVEL_4')]",
          ),
        ),
    )
  })

  it('should update Education containing no previous qualifications', () => {
    // Given
    cy.task('stubGetEducation', { hasQualifications: false })
    // Induction has highest level of education as SECONDARY_SCHOOL_TOOK_EXAMS with no previously recorded qualifications

    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    const highestLevelOfEducationPage =
      Page.verifyOnPage(EducationAndTrainingPage).clickToChangeHighestLevelOfEducation()

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/person/${prisonNumber}/education`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.educationLevel == 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' && " +
              "@.reference == 'dea24acc-fde5-4ead-a9eb-e1757de2542c' && " +
              '@.qualifications.size() == 0)]',
          ),
        ),
    )
  })

  it('should not update Education and redisplay Highest Level of Education page given calling API is not successful', () => {
    // Given
    cy.task('stubUpdateEducation500Error')

    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    const highestLevelOfEducationPage =
      Page.verifyOnPage(EducationAndTrainingPage).clickToChangeHighestLevelOfEducation()

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Then
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .apiErrorBannerIsDisplayed()
  })
})
