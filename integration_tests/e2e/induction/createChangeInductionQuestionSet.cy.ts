/**
 * Cypress tests that change the question set of a new Induction by updating the answer to 'Hoping to work on release'
 * from the Check Your Answers page.
 * Refer to the screen/process flow description and diagram in `/docs/induction.md`
 */
import Page from '../../pages/page'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context(`Change new Induction question set by updating 'Hoping to work on release' from Check Your Answers`, () => {
  const prisonNumberForPrisonerWithNoInduction = 'A00001A'

  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
  })

  it(`should change a long question set Induction into a short question set Induction given 'Hoping to work on release' is changed to No from Check Your Answers`, () => {
    // Given
    cy.createLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumberForPrisonerWithNoInduction)
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickHopingToWorkOnReleaseChangeLink()
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Reasons Not To Work is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(ReasonsNotToGetWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/hoping-to-work-on-release`)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .submitPage()

    // Qualifications List is the next page. Qualifications are asked on the long question set, so this will already have qualifications set
    // Add a new qualification; just to test going through each page in the flow
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/reasons-not-to-get-work`)
      .clickToAddAnotherQualification()
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/qualification-level`)
      .setQualificationSubject('Spanish')
      .setQualificationGrade('Distinction')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage) //
      .submitPage()

    // Additional Training is the next page. This is asked on the long question set, so this will already have answers set
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/qualifications`)
      .submitPage()

    // In Prison Work Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/additional-training`)
      .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .submitPage()

    // In Prison Training Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/in-prison-work`)
      .chooseInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to save the induction
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'NO' && " +
              '@.workOnRelease.notHopingToWorkReasons.size() == 1 && ' +
              "@.workOnRelease.notHopingToWorkReasons[0] == 'HEALTH' && " +
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 2 && ' +
              "@.previousQualifications.qualifications[0].subject == 'Computer science' && " +
              "@.previousQualifications.qualifications[0].grade == 'A*' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_4' && " +
              "@.previousQualifications.qualifications[1].subject == 'Spanish' && " +
              "@.previousQualifications.qualifications[1].grade == 'Distinction' && " +
              "@.previousQualifications.qualifications[1].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'CLEANING_AND_HYGIENE' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'BARBERING_AND_HAIRDRESSING' && !@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther)]",
          ),
        ),
    )
  })
})
