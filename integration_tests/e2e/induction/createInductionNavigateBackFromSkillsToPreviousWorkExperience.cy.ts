import { startOfToday, sub } from 'date-fns'
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import WantToAddQualificationsPage from '../../pages/prePrisonEducation/WantToAddQualificationsPage'
import YesNoValue from '../../../server/enums/yesNoValue'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import SkillsValue from '../../../server/enums/skillsValue'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import WhoCompletedInductionPage from '../../pages/induction/WhoCompletedInductionPage'
import SessionCompletedByValue from '../../../server/enums/sessionCompletedByValue'
import InductionNotePage from '../../pages/induction/InductionNotePage'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Create induction having navigated back from Skills to Previous Work Experience to correct some data', () => {
  const inductionConductedAt = sub(startOfToday(), { weeks: 1 })
  const inductionConductedAtDay = `${inductionConductedAt.getDate()}`.padStart(2, '0')
  const inductionConductedAtMonth = `${inductionConductedAt.getMonth() + 1}`.padStart(2, '0')
  const inductionConductedAtYear = `${inductionConductedAt.getFullYear()}`

  const prisonNumberForPrisonerWithNoInduction = 'A00001A'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerQualifications', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetEducation404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
  })

  it('should be able to navigate back from Skills to Previous Work Experience to correct some data, to then proceed forwards to create the Induction', () => {
    // Given
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    // When
    Page.verifyOnPage(OverviewPage) //
      .clickMakeProgressPlan()
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .selectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    Page.verifyOnPage(HighestLevelOfEducationPage) //
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Want To Add Qualifications page is next
    Page.verifyOnPage(WantToAddQualificationsPage) //
      .selectWantToAddQualifications(YesNoValue.NO)
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .selectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()

    // Previous Work Experience Types is the next page
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.BEAUTY)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.TECHNICAL)
      .submitPage()

    // Previous Work Experience Details pages are next - once for each work industry type submitted on the previous page
    // First is Construction
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .setJobRole('General labourer')
      .setJobDetails('Basic ground works and building')
      .submitPage()
    // Next is Beauty
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .setJobRole('Hair dresser')
      .setJobDetails('Cutting hair')
      .submitPage()
    // Next is Technical
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .setJobRole('Software developer')
      .setJobDetails('Writing code')
      .submitPage()

    // Personal Skills page is next; click Back twice to arrive on the PreviousWorkExperienceDetailPage for Beauty
    Page.verifyOnPage(SkillsPage) //
      .clickBackLinkTo(PreviousWorkExperienceDetailPage)
      .clickBackLinkTo(PreviousWorkExperienceDetailPage)

    // Verify the previous values for Beauty were set, then change them
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasJobRole('Hair dresser')
      .hasJobDetails('Cutting hair')
      .setJobRole('Hair stylist')
      .setJobDetails('Cutting and styling hair')
      .submitPage()

    // Verify the previous values for Technical were set, then change them
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasJobRole('Software developer')
      .hasJobDetails('Writing code')
      .setJobRole('Junior software developer')
      .setJobDetails('Writing tests and code')
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .selectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .selectPersonalInterest(PersonalInterestsValue.COMMUNITY)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .selectWorkType(InPrisonWorkValue.KITCHENS_AND_COOKING)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .selectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Who Completed Induction page is next
    Page.verifyOnPage(WhoCompletedInductionPage) //
      .selectWhoCompletedTheReview(SessionCompletedByValue.MYSELF)
      .setInductionDate(inductionConductedAt)
      .submitPage()

    // Induction Notes page is next
    Page.verifyOnPage(InductionNotePage) //
      .setInductionNote('Induction went well')
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
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 0 && ' +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousWorkExperiences.hasWorkedBefore === 'YES' && " +
              '@.previousWorkExperiences.experiences.size() == 3 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'CONSTRUCTION' && " +
              "@.previousWorkExperiences.experiences[0].role == 'General labourer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Basic ground works and building' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'BEAUTY' && " +
              "@.previousWorkExperiences.experiences[1].role == 'Hair stylist' && " +
              "@.previousWorkExperiences.experiences[1].details == 'Cutting and styling hair' && " +
              "@.previousWorkExperiences.experiences[2].experienceType == 'TECHNICAL' && " +
              "@.previousWorkExperiences.experiences[2].role == 'Junior software developer' && " +
              "@.previousWorkExperiences.experiences[2].details == 'Writing tests and code' && " +
              '@.futureWorkInterests.interests.size() == 0 && ' +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'NONE' && " +
              '!@.workOnRelease.affectAbilityToWorkOther && ' +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'KITCHENS_AND_COOKING' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING' && " +
              "@.note == 'Induction went well' && " +
              `@.conductedAt == '${inductionConductedAtYear}-${inductionConductedAtMonth}-${inductionConductedAtDay}' && ` +
              '!@.conductedBy && ' +
              '!@.conductedByRole' +
              ')]',
          ),
        ),
    )
  })
})
