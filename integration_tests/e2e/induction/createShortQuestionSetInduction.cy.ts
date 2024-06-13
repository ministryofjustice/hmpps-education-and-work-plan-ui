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
import SkillsPage from '../../pages/induction/SkillsPage'
import SkillsValue from '../../../server/enums/skillsValue'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

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

    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .hasErrorCount(1)
      .hasFieldInError('educationLevel')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
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
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
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
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
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

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .hasErrorCount(1)
      .hasFieldInError('hasWorkedBefore')
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()

    // Previous Work Experience Types is the next page
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .hasErrorCount(1)
      .hasFieldInError('typeOfWorkExperience')
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OTHER)
      .setOtherPreviousWorkExperienceType('Entertainment industry')
      .submitPage()

    // Previous Work Experience Details page is next - once for each work industry type submitted on the previous page
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/previous-work-experience')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/previous-work-experience')
      .hasErrorCount(2)
      .hasFieldInError('jobRole')
      .hasFieldInError('jobDetails')
      .setJobRole('General labourer')
      .setJobDetails('Basic ground works and building')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/previous-work-experience/construction')
      .setJobRole('Nightclub DJ')
      .setJobDetails('Self employed DJ operating in bars and clubs')
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .hasErrorCount(1)
      .hasFieldInError('skills')
      .chooseSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .hasErrorCount(1)
      .hasFieldInError('personalInterests')
      .choosePersonalInterest(PersonalInterestsValue.COMMUNITY)
      .choosePersonalInterest(PersonalInterestsValue.DIGITAL)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
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
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 1 && ' +
              "@.previousQualifications.qualifications[0].subject == 'Physics' && " +
              "@.previousQualifications.qualifications[0].grade == 'B' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 2 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousTraining.trainingTypes[1] == 'OTHER' && " +
              "@.previousTraining.trainingTypeOther == 'Basic accountancy course' && " +
              "@.previousWorkExperiences.hasWorkedBefore === 'YES' && " +
              '@.previousWorkExperiences.experiences.size() == 2 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'CONSTRUCTION' && " +
              "@.previousWorkExperiences.experiences[0].role == 'General labourer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Basic ground works and building' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'OTHER' && " +
              "@.previousWorkExperiences.experiences[1].experienceTypeOther == 'Entertainment industry' && " +
              "@.previousWorkExperiences.experiences[1].role == 'Nightclub DJ' && " +
              "@.previousWorkExperiences.experiences[1].details == 'Self employed DJ operating in bars and clubs' && " +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 2 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              "@.personalSkillsAndInterests.interests[1].interestType == 'DIGITAL' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'KITCHENS_AND_COOKING' && " +
              "@.inPrisonInterests.inPrisonWorkInterests[1].workType == 'PRISON_LIBRARY' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING')]",
          ),
        ),
    )
  })

  it('should create a short question set Induction with no qualifications and no previous work', () => {
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

    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .selectWantToAddQualifications(YesNoValue.NO)
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .selectWorkedBefore(HasWorkedBeforeValue.NO)
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .chooseSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .choosePersonalInterest(PersonalInterestsValue.COMMUNITY)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
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
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 0 && ' +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousWorkExperiences.hasWorkedBefore === 'NO' && " +
              '@.previousWorkExperiences.experiences.size() == 0 && ' +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING')]",
          ),
        ),
    )
  })
})
