import Page from '../../pages/page'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'

/**
 * Cypress tests that change the Induction question set by updating the answer to 'Hoping to work on release'
 * Refer to the screen/process flow description and diagram in `/docs/induction.md`
 */
context(`Change Induction question set by updating the answer to 'Hoping to work on release'`, () => {
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
    cy.signIn()
  })

  it(`should update a long question set Induction into a short question set Induction given form submitted with 'Hoping to work on release' as No`, () => {
    // Given
    cy.task('stubGetInductionLongQuestionSet') // Short question set Induction with Hoping to work on release as YES

    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage).hasBackLinkTo(
      `/plan/${prisonNumber}/view/work-and-interests`,
    )

    // When
    hopingToWorkOnReleasePage //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Reasons Not To Work is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .submitPage()

    // Qualifications List is the next page. Qualifications are asked on the long question set, so this will already have qualifications set
    // Add a new qualification; just to test going through each page in the flow
    Page.verifyOnPage(QualificationsListPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
      .clickToAddAnotherQualification()
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualification-level`)
      .setQualificationSubject('Spanish')
      .setQualificationGrade('Distinction')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
      .submitPage()

    // Additional Training is the next page. This is asked on the long question set, so this will already have answers set
    Page.verifyOnPage(AdditionalTrainingPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)
      .submitPage()

    // In Prison Work Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/additional-training`)
      .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .submitPage()

    // In Prison Training Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/in-prison-work`)
      .chooseInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to save the induction
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'NO' && " +
              '@.workOnRelease.notHopingToWorkReasons.size() == 1 && ' +
              "@.workOnRelease.notHopingToWorkReasons[0] == 'HEALTH' && " +
              "@.previousQualifications.educationLevel == 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' && " +
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
              "@.previousQualifications.qualifications[4].grade == 'Distinction' && " +
              "@.previousQualifications.qualifications[4].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 3 && ' +
              "@.previousTraining.trainingTypes[0] == 'FULL_UK_DRIVING_LICENCE' && " +
              "@.previousTraining.trainingTypes[1] == 'HGV_LICENCE' && " +
              "@.previousTraining.trainingTypes[2] == 'OTHER' && " +
              "@.previousTraining.trainingTypeOther == 'Accountancy Certification' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'CLEANING_AND_HYGIENE' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'BARBERING_AND_HAIRDRESSING' && !@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther)]",
          ),
        ),
    )
  })
})
