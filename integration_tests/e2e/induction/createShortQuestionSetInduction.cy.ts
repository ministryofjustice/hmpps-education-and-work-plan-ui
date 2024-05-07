import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import WantToAddQualificationsPage from '../../pages/induction/WantToAddQualificationsPage'
import YesNoValue from '../../../server/enums/yesNoValue'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Create a short question set Induction', () => {
  const prisonNumberForPrisonerWithNoInduction = 'A00001A'

  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)
  })

  it('should create a short question set Induction with qualifications, triggering validation on every screen', () => {
    // Given
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickMakeProgressPlan()
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasErrorCount(1)
      .hasFieldInError('reasonsNotToGetWork')
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.FULL_TIME_CARER)
      .submitPage()

    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .hasErrorCount(1)
      .hasFieldInError('wantToAddQualifications')
      .selectWantToAddQualifications(YesNoValue.YES)
      .submitPage()

    // Qualification Level page is next
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .hasErrorCount(1)
      .hasFieldInError('qualificationLevel')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()

    // Qualification Detail page is next
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .hasErrorCount(2)
      .hasFieldInError('qualificationSubject')
      .hasFieldInError('qualificationGrade')
      .setQualificationSubject('Computer science')
      .setQualificationGrade('A*')
      .submitPage()

    // Qualifications List page is displayed again. Add another qualification
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasEducationalQualifications(['Computer science'])
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualification-level')
      .setQualificationSubject('Physics')
      .setQualificationGrade('B')
      .submitPage()

    // Qualifications List page is displayed again. Remove a qualification
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasEducationalQualifications(['Computer science', 'Physics'])
      .removeQualification(1) // remove Computer science
      .hasEducationalQualifications(['Physics'])
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .hasErrorCount(1)
      .hasFieldInError('additionalTraining')
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .chooseAdditionalTraining(AdditionalTrainingValue.OTHER)
      .setAdditionalTrainingOther('Basic accountancy course')
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .chooseWorkType(InPrisonWorkValue.KITCHENS_AND_COOKING)
      .chooseWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .chooseInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to create the induction
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'NO' && " +
              '@.workOnRelease.notHopingToWorkReasons.size() == 2 && ' +
              "@.workOnRelease.notHopingToWorkReasons[0] == 'FULL_TIME_CARER' && " +
              "@.workOnRelease.notHopingToWorkReasons[1] == 'HEALTH' && " +
              "@.workOnRelease.notHopingToWorkOtherReason == '' && " +
              '@.previousQualifications.qualifications.size() == 1 && ' +
              "@.previousQualifications.qualifications[0].subject == 'Physics' && " +
              "@.previousQualifications.qualifications[0].grade == 'B' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 2 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousTraining.trainingTypes[1] == 'OTHER' && " +
              "@.previousTraining.trainingTypeOther == 'Basic accountancy course' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'KITCHENS_AND_COOKING' && " +
              "@.inPrisonInterests.inPrisonWorkInterests[1].workType == 'PRISON_LIBRARY' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING')]",
          ),
        ),
    )
  })

  it('should create a short question set Induction with no qualifications', () => {
    // Given
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickMakeProgressPlan()
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.FULL_TIME_CARER)
      .submitPage()

    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .selectWantToAddQualifications(YesNoValue.NO)
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .chooseWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .chooseInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to create the induction
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
              "@.workOnRelease.notHopingToWorkReasons[0] == 'FULL_TIME_CARER' && " +
              "@.workOnRelease.notHopingToWorkOtherReason == '' && " +
              '!@.previousQualifications && ' +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING')]",
          ),
        ),
    )
  })
})
