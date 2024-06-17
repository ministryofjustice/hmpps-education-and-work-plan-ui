import Page from '../../pages/page'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'

context('Update highest level of education within an Induction', () => {
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

  /* Induction has highest level of education of UNDERGRADUATE_DEGREE_AT_UNIVERSITY
     with the following qualifications:
       French, grade C, LEVEL_3
       Maths, grade A, level LEVEL_3
       Maths, grade 1st, level LEVEL_6
       English, grade A, level LEVEL_3
   */

  it('should update Induction containing previous qualifications given form submitted with non exam level highest level of education', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    const highestLevelOfEducationPage = Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/G6115VJ/view/education-and-training`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' && " +
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

  it('should update Induction containing previous qualifications given form submitted with exam level highest level of education', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    const highestLevelOfEducationPage = Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/G6115VJ/view/education-and-training`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'POSTGRADUATE_DEGREE_AT_UNIVERSITY' && " +
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

  it('should update Induction containing no previous qualifications given form submitted with non exam level highest level of education', () => {
    // Given
    cy.task('stubGetInduction', { hasQualifications: false })
    // Induction has highest level of education as UNDERGRADUATE_DEGREE_AT_UNIVERSITY with no previously recorded qualifications

    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    const highestLevelOfEducationPage = Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/plan/G6115VJ/view/education-and-training`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    highestLevelOfEducationPage //
      .selectHighestLevelOfEducation(EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' && " +
              '@.previousQualifications.qualifications.size() == 0)]',
          ),
        ),
    )
  })

  it('should update highest level of education given induction created with the original short question set which did not ask about highest level of education', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetOriginalQuestionSetInduction', { questionSet: 'SHORT' }) // The original short question set Induction did not ask about Highest Level of Education
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .highestLevelOfEducationChangeLinkHasText('Add')
      .clickToChangeHighestLevelOfEducation()

    // When
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .selectHighestLevelOfEducation(EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousQualifications.educationLevel == 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' && " +
              '@.previousQualifications.qualifications.size() == 4)]',
          ),
        ),
    )
  })
})
