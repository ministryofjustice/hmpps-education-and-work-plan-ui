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
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import YesNoValue from '../../../server/enums/yesNoValue'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import WantToAddQualificationsPage from '../../pages/induction/WantToAddQualificationsPage'

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
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Reasons Not To Work is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
    Page.verifyOnPage(ReasonsNotToGetWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/hoping-to-work-on-release`)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .submitPage()

    // Highest Level of Education is next. This is asked on the long question set, so this will already have answers set
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/reasons-not-to-get-work`)
      .submitPage()

    // Want To Add Qualifications page is next. Qualifications were already added as part of the long question set Induction, so this will already be set to Yes
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/highest-level-of-education`)
      .submitPage()

    // Qualification Level page is next. Add a new qualification just to test going through each page in the flow
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/want-to-add-qualifications`)
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

    // Personal skills page is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/additional-training`)
      .submitPage()

    // Personal Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/skills`)
      .submitPage()

    // In Prison Work Interests is the next page. This is asked on the long question set, so this will already have answers set
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/personal-interests`)
      .submitPage()

    // In Prison Training Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/in-prison-work`)
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
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING' && !@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther)]",
          ),
        ),
    )
  })

  it(`should change a short question set Induction with qualifications into a long question set Induction with no qualifications given 'Hoping to work on release' is changed to Yes from Check Your Answers`, () => {
    // Given
    cy.createShortQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumberForPrisonerWithNoInduction, true)
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickHopingToWorkOnReleaseChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()

    // Work Interests page is the next page. This is not asked on the short question set.
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/hoping-to-work-on-release`)
      .chooseWorkInterestType(WorkInterestTypeValue.CONSTRUCTION)
      .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
      .submitPage()
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/work-interest-types`)
      .setWorkInterestRole(WorkInterestTypeValue.CONSTRUCTION, 'General builder')
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Driving instructor')
      .submitPage()

    // Highest Level of Education is next. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/work-interest-roles`)
      .submitPage()

    // Want To Add Qualifications page is next. Qualifications were already added as part of the short question set Induction, so this will already be set to Yes. Change to No
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/highest-level-of-education`)
      .selectWantToAddQualifications(YesNoValue.NO)
      .submitPage()

    // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/want-to-add-qualifications`)
      .submitPage()

    // 'Has the prisoner worked before' is the next page. This is not asked on the short question set.
    // Answer 'Yes' to test going through the subsequent pages that ask about previous work experience.
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/additional-training`)
      .selectWorkedBefore(YesNoValue.YES)
      .submitPage()

    // Preview Work Experience types is the next page. This is not asked on the short question set.
    // Select 2 previous work experience types as that will cause the next page (work experience detail) to be displayed twice.
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/has-worked-before`)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.TECHNICAL)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/previous-work-experience`)
      .setJobRole('Software developer')
      .setJobDetails('Designing, developing and testing software: Dec 2009 - Aug 2020')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo(
        `/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/previous-work-experience/technical`,
      )
      .setJobRole('Office junior')
      .setJobDetails('Filing and photocopying: Sept 2000 - Dec 2009')
      .submitPage()

    // Personal skills page is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/has-worked-before`)
      .submitPage()

    // Personal Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/skills`)
      .submitPage()

    // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/personal-interests`)
      .chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES)
      .submitPage()

    // In Prison Work Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/affect-ability-to-work`)
      .submitPage()

    // In Prison Training Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/in-prison-work`)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to save the induction
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage) //
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 0 && ' +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              '@.previousWorkExperiences.hasWorkedBefore == true && ' +
              '@.previousWorkExperiences.experiences.size() == 2 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'TECHNICAL' && " +
              "@.previousWorkExperiences.experiences[0].role == 'Software developer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Designing, developing and testing software: Dec 2009 - Aug 2020' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'OFFICE' && " +
              "@.previousWorkExperiences.experiences[1].role == 'Office junior' && " +
              "@.previousWorkExperiences.experiences[1].details == 'Filing and photocopying: Sept 2000 - Dec 2009' && " +
              '@.futureWorkInterests.interests.size() == 2 && ' +
              "@.futureWorkInterests.interests[0].workType == 'CONSTRUCTION' && " +
              "@.futureWorkInterests.interests[0].role == 'General builder' && " +
              "@.futureWorkInterests.interests[1].workType == 'DRIVING' && " +
              "@.futureWorkInterests.interests[1].role == 'Driving instructor' && " +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'HEALTH_ISSUES' && " +
              "@.workOnRelease.affectAbilityToWorkOther == '' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING' && !@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther)]",
          ),
        ),
    )
  })

  it(`should change a short question set Induction without qualifications into a long question set Induction given 'Hoping to work on release' is changed to Yes from Check Your Answers`, () => {
    // Given
    cy.createShortQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumberForPrisonerWithNoInduction, false)
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickHopingToWorkOnReleaseChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()

    // Work Interests page is the next page. This is not asked on the short question set.
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/hoping-to-work-on-release`)
      .chooseWorkInterestType(WorkInterestTypeValue.CONSTRUCTION)
      .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
      .submitPage()
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/work-interest-types`)
      .setWorkInterestRole(WorkInterestTypeValue.CONSTRUCTION, 'General builder')
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Driving instructor')
      .submitPage()

    // Highest Level of Education is next. This is asked on the short question set, so this will already have answers set, but we will change it
    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/work-interest-roles`)
      .selectHighestLevelOfEducation(EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY)
      .submitPage()

    // Want To Add Qualifications page is next. Qualifications were not added as part of the short question set Induction, so this will already be set to No. Change to Yes
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/highest-level-of-education`)
      .selectWantToAddQualifications(YesNoValue.YES)
      .submitPage()

    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/want-to-add-qualifications`)
      .selectQualificationLevel(QualificationLevelValue.LEVEL_8)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/qualification-level`)
      .setQualificationSubject('Geography')
      .setQualificationGrade('1st')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage) //
      .submitPage()

    // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/qualifications`)
      .submitPage()

    // 'Has the prisoner worked before' is the next page. This is not asked on the short question set.
    // Answer 'Yes' to test going through the subsequent pages that ask about previous work experience.
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/additional-training`)
      .selectWorkedBefore(YesNoValue.YES)
      .submitPage()

    // Preview Work Experience types is the next page. This is not asked on the short question set.
    // Select 2 previous work experience types as that will cause the next page (work experience detail) to be displayed twice.
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/has-worked-before`)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.TECHNICAL)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/previous-work-experience`)
      .setJobRole('Software developer')
      .setJobDetails('Designing, developing and testing software: Dec 2009 - Aug 2020')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo(
        `/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/previous-work-experience/technical`,
      )
      .setJobRole('Office junior')
      .setJobDetails('Filing and photocopying: Sept 2000 - Dec 2009')
      .submitPage()

    // Personal skills page is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/has-worked-before`)
      .submitPage()

    // Personal Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/skills`)
      .submitPage()

    // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/personal-interests`)
      .chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES)
      .submitPage()

    // In Prison Work Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/affect-ability-to-work`)
      .submitPage()

    // In Prison Training Interests is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/in-prison-work`)
      .submitPage()

    // Check Your Answers is the final page. Submit the page to save the induction
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(CreateGoalsPage) //
    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              "@.previousQualifications.educationLevel == 'POSTGRADUATE_DEGREE_AT_UNIVERSITY' && " +
              '@.previousQualifications.qualifications.size() == 1 && ' +
              "@.previousQualifications.qualifications[0].subject == 'Geography' && " +
              "@.previousQualifications.qualifications[0].grade == '1st' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_8' && " +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              '@.previousWorkExperiences.hasWorkedBefore == true && ' +
              '@.previousWorkExperiences.experiences.size() == 2 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'TECHNICAL' && " +
              "@.previousWorkExperiences.experiences[0].role == 'Software developer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Designing, developing and testing software: Dec 2009 - Aug 2020' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'OFFICE' && " +
              "@.previousWorkExperiences.experiences[1].role == 'Office junior' && " +
              "@.previousWorkExperiences.experiences[1].details == 'Filing and photocopying: Sept 2000 - Dec 2009' && " +
              '@.futureWorkInterests.interests.size() == 2 && ' +
              "@.futureWorkInterests.interests[0].workType == 'CONSTRUCTION' && " +
              "@.futureWorkInterests.interests[0].role == 'General builder' && " +
              "@.futureWorkInterests.interests[1].workType == 'DRIVING' && " +
              "@.futureWorkInterests.interests[1].role == 'Driving instructor' && " +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'HEALTH_ISSUES' && " +
              "@.workOnRelease.affectAbilityToWorkOther == '' && " +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING' && !@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther)]",
          ),
        ),
    )
  })
})
