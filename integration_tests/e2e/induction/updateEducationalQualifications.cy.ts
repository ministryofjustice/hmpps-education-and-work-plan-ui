import Page from '../../pages/page'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update educational qualifications within an Induction', () => {
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
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should display the Qualifications List page given Curious is unavailable for both Functional Skills and In-Prison Courses & Qualifications', () => {
    // Given
    cy.task('stubLearnerProfile401Error') // Functional Skills from come the Learner Profile
    cy.task('stubLearnerEducation401Error') // In-Prison Courses & Qualifications come from the Learner Education

    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)

    // Then
    /* Induction has highest level of education of UNDERGRADUATE_DEGREE_AT_UNIVERSITY with the following qualifications:
         French, grade C, LEVEL_3
         Maths, grade A, level LEVEL_3
         Maths, grade 1st, level LEVEL_6
         English, grade A, level LEVEL_3
    */
    qualificationsListPage //
      .hasEducationalQualifications(['French', 'Maths', 'Maths', 'English'])
      .hasFunctionalSkillsCuriousUnavailableMessageDisplayed()
      .hasInPrisonCoursesCuriousUnavailableMessageDisplayed()
  })

  it('should update Induction and redirect back to Education & Training page given Qualifications List page is submitted without having made any changes', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo(`/plan/G6115VJ/view/education-and-training`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    /* Induction has highest level of education of UNDERGRADUATE_DEGREE_AT_UNIVERSITY with the following qualifications:
         French, grade C, LEVEL_3
         Maths, grade A, level LEVEL_3
         Maths, grade 1st, level LEVEL_6
         English, grade A, level LEVEL_3
    */

    qualificationsListPage //
      .hasEducationalQualifications(['French', 'Maths', 'Maths', 'English'])

    // When
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' && " +
              '@.previousQualifications.qualifications.size() == 4 && ' +
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
              "@.previousQualifications.qualifications[3].level == 'LEVEL_3')]",
          ),
        ),
    )
  })

  it('should remove qualifications and call API to update Induction', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)

    /* Induction has highest level of education of UNDERGRADUATE_DEGREE_AT_UNIVERSITY with the following qualifications:
         French, grade C, LEVEL_3
         Maths, grade A, level LEVEL_3
         Maths, grade 1st, level LEVEL_6
         English, grade A, level LEVEL_3
    */

    qualificationsListPage //
      .hasEducationalQualifications(['French', 'Maths', 'Maths', 'English'])

    // When
    qualificationsListPage //
      .removeQualification(2) // Remove Level 3 Maths
      .removeQualification(3) // Remove Level 3 English (bearing in mind the indexing will have changed following the first remove operation
    qualificationsListPage.hasEducationalQualifications(['French', 'Maths'])
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' && " +
              '@.previousQualifications.qualifications.size() == 2 && ' +
              "@.previousQualifications.qualifications[0].subject == 'French' && " +
              "@.previousQualifications.qualifications[0].grade == 'C' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_3' && " +
              "@.previousQualifications.qualifications[1].subject == 'Maths' && " +
              "@.previousQualifications.qualifications[1].grade == '1st' && " +
              "@.previousQualifications.qualifications[1].level == 'LEVEL_6')]",
          ),
        ),
    )
  })

  it('should remove all qualifications and call API to update Induction', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/qualifications`)
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage)

    /* Induction has highest level of education of UNDERGRADUATE_DEGREE_AT_UNIVERSITY with the following qualifications:
         French, grade C, LEVEL_3
         Maths, grade A, level LEVEL_3
         Maths, grade 1st, level LEVEL_6
         English, grade A, level LEVEL_3
    */

    qualificationsListPage //
      .hasEducationalQualifications(['French', 'Maths', 'Maths', 'English'])

    // When
    qualificationsListPage //
      .removeQualification(4) // Remove Level 3 English
      .removeQualification(3) // Remove Level 6 Maths
      .removeQualification(2) // Remove Level 3 Maths
      .removeQualification(1) // Remove Level 3 French
    qualificationsListPage.hasNoEducationalQualificationsDisplayed()
    qualificationsListPage.submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' && " +
              '@.previousQualifications.qualifications.size() == 0)]',
          ),
        ),
    )
  })
})
