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
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import YesNoValue from '../../../server/enums/yesNoValue'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import SkillsValue from '../../../server/enums/skillsValue'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'

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
    cy.task('stubGetInductionLongQuestionSet') // Long question set Induction with Hoping to work on release as YES

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

  it(`should update a short question set Induction into a long question set Induction given form submitted with 'Hoping to work on release' as Yes`, () => {
    // Given
    cy.task('stubGetInductionShortQuestionSet') // Short question set Induction with Hoping to work on release as NO

    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage).hasBackLinkTo(
      `/plan/${prisonNumber}/view/work-and-interests`,
    )

    // When
    hopingToWorkOnReleasePage //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()

    // Qualifications List is the next page. Qualifications are asked on the short question set, so this will already have qualifications set
    // Add a new qualification; just to test going through each page in the flow
    Page.verifyOnPage(QualificationsListPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
      .clickToAddAnotherQualification()
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/qualification-level`)
      .setQualificationSubject('Spanish')
      .setQualificationGrade('Distinction')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
      .submitPage()

    // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
    Page.verifyOnPage(AdditionalTrainingPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)
      .submitPage()

    // 'Has the prisoner worked before' is the next page. This is not asked on the short question set.
    // Answer 'Yes' to test going through the subsequent pages that ask about previous work experience.
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/additional-training`)
      .selectWorkedBefore(YesNoValue.YES)
      .submitPage()

    // Preview Work Experience types is the next page. This is not asked on the short question set.
    // Select 2 previous work experience types as that will cause the next page (work experience detail) to be displayed twice.
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/has-worked-before`)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.TECHNICAL)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      .setJobRole('Software developer')
      .setJobDetails('Designing, developing and testing software: Dec 2009 - Aug 2020')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/previous-work-experience/technical`)
      .setJobRole('Office junior')
      .setJobDetails('Filing and photocopying: Sept 2000 - Dec 2009')
      .submitPage()

    // Work Interests page is the next page. This is not asked on the short question set.
    Page.verifyOnPage(FutureWorkInterestTypesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      .chooseWorkInterestType(WorkInterestTypeValue.CONSTRUCTION)
      .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
      .submitPage()
    Page.verifyOnPage(FutureWorkInterestRolesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/work-interest-types`)
      .setWorkInterestRole(WorkInterestTypeValue.CONSTRUCTION, 'General builder')
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Driving instructor')
      .submitPage()

    // Personal skills page is the next page. This is not asked on the short question set.
    Page.verifyOnPage(SkillsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/work-interest-roles`)
      .chooseSkill(SkillsValue.TEAMWORK)
      .chooseSkill(SkillsValue.WILLINGNESS_TO_LEARN)
      .submitPage()

    // Personal Interests is the next page. This is not asked on the short question set.
    Page.verifyOnPage(PersonalInterestsPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/skills`)
      .choosePersonalInterest(PersonalInterestsValue.OUTDOOR)
      .choosePersonalInterest(PersonalInterestsValue.SOCIAL)
      .submitPage()

    // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
    Page.verifyOnPage(AffectAbilityToWorkPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/personal-interests`)
      .chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES)
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
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              "@.previousQualifications.educationLevel == 'NOT_SURE' && " +
              '@.previousQualifications.qualifications.size() == 2 && ' +
              "@.previousQualifications.qualifications[0].subject == 'English' && " +
              "@.previousQualifications.qualifications[0].grade == 'C' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_6' && " +
              "@.previousQualifications.qualifications[1].subject == 'Spanish' && " +
              "@.previousQualifications.qualifications[1].grade == 'Distinction' && " +
              "@.previousQualifications.qualifications[1].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'FULL_UK_DRIVING_LICENCE' && " +
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
              '@.personalSkillsAndInterests.skills.size() == 2 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'TEAMWORK' && " +
              "@.personalSkillsAndInterests.skills[1].skillType == 'WILLINGNESS_TO_LEARN' && " +
              '@.personalSkillsAndInterests.interests.size() == 2 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'OUTDOOR' && " +
              "@.personalSkillsAndInterests.interests[1].interestType == 'SOCIAL' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'HEALTH_ISSUES' && " +
              "@.workOnRelease.affectAbilityToWorkOther == '')]",
          ),
        ),
    )
  })
})
