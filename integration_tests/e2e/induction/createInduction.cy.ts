import { startOfToday, sub } from 'date-fns'
import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from '../../pages/prePrisonEducation/QualificationsListPage'
import HighestLevelOfEducationPage from '../../pages/prePrisonEducation/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/prePrisonEducation/QualificationDetailsPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
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
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import WantToAddQualificationsPage from '../../pages/prePrisonEducation/WantToAddQualificationsPage'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import YesNoValue from '../../../server/enums/yesNoValue'
import WhoCompletedInductionPage from '../../pages/induction/WhoCompletedInductionPage'
import SessionCompletedByValue from '../../../server/enums/sessionCompletedByValue'
import InductionNotePage from '../../pages/induction/InductionNotePage'

context('Create an Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
  })

  const inductionConductedAt = sub(startOfToday(), { weeks: 1 })
  const inductionConductedAtDay = `${inductionConductedAt.getDate()}`.padStart(2, '0')
  const inductionConductedAtMonth = `${inductionConductedAt.getMonth() + 1}`.padStart(2, '0')
  const inductionConductedAtYear = `${inductionConductedAt.getFullYear()}`

  it('should create an induction with qualifications given prisoner has no previously recorded education, triggering validation on every screen', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetEducation404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const hopingToWorkOnReleasePage = overviewPage //
      .clickMakeProgressPlan()
      .hasBackLinkTo('/plan/A00001A/view/overview')
    // submit the page without answering the question to trigger a validation error
    hopingToWorkOnReleasePage.submitPage()
    hopingToWorkOnReleasePage //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES) // Answer the question and submit the page
      .submitPage()

    // Future Work Interest Types page is next
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasErrorCount(1)
      .hasFieldInError('workInterestTypes')
      .selectWorkInterestType(WorkInterestTypeValue.OUTDOOR)
      .selectWorkInterestType(WorkInterestTypeValue.DRIVING)
      .selectWorkInterestType(WorkInterestTypeValue.OTHER)
      .setWorkInterestTypesOther('Natural world')
      .submitPage()

    // Future Work Interest Roles page is next, with a field for each work interest type
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-types')
      .setWorkInterestRole(WorkInterestTypeValue.OUTDOOR, 'Farm hand')
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Delivery driver')
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Botanist')
      .submitPage()

    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
      .hasErrorCount(1)
      .hasFieldInError('affectAbilityToWork')
      .selectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    // Highest level of education is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/affect-ability-to-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/affect-ability-to-work')
      .hasErrorCount(1)
      .hasFieldInError('educationLevel')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Want To Add Qualifications page is next
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
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
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
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
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
      .selectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .selectAdditionalTraining(AdditionalTrainingValue.OTHER)
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
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OTHER)
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
      .selectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .hasErrorCount(1)
      .hasFieldInError('personalInterests')
      .selectPersonalInterest(PersonalInterestsValue.COMMUNITY)
      .selectPersonalInterest(PersonalInterestsValue.DIGITAL)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .hasErrorCount(1)
      .hasFieldInError('inPrisonWork')
      .selectWorkType(InPrisonWorkValue.KITCHENS_AND_COOKING)
      .selectWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .hasErrorCount(1)
      .hasFieldInError('inPrisonTraining')
      .selectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Who Completed Induction page is next
    Page.verifyOnPage(WhoCompletedInductionPage) //
      .submitPage()
    Page.verifyOnPage(WhoCompletedInductionPage) //
      .hasErrorCount(2)
      .hasFieldInError('completedBy')
      .hasFieldInError('induction-date')
      .selectWhoCompletedTheReview(SessionCompletedByValue.SOMEBODY_ELSE)
      .enterFullName('Joe Bloggs')
      .enterJobRole('Peer Mentor')
      .setInductionDate(inductionConductedAtDay, inductionConductedAtMonth, inductionConductedAtYear)
      .submitPage()

    // Induction Notes page is next
    Page.verifyOnPage(InductionNotePage) //
      .setInductionNote('a'.repeat(513))
      .submitPage()
    Page.verifyOnPage(InductionNotePage) //
      .hasErrorCount(1)
      .hasFieldInError('notes')
      .clearInductionNote()
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
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 1 && ' +
              '!@.previousQualifications.qualifications[0].reference && ' + // assert the qualification has no reference as it is a new qualification that wont have a reference until the API has created it
              "@.previousQualifications.qualifications[0].subject == 'Physics' && " +
              "@.previousQualifications.qualifications[0].grade == 'B' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 2 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousTraining.trainingTypes[1] == 'OTHER' && " +
              "@.previousTraining.trainingTypeOther == 'Basic accountancy course' && " +
              "@.previousWorkExperiences.hasWorkedBefore == 'YES' && " +
              '!@.previousWorkExperiences.hasWorkedBeforeNotRelevantReason && ' +
              '@.previousWorkExperiences.experiences.size() == 2 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'CONSTRUCTION' && " +
              "@.previousWorkExperiences.experiences[0].role == 'General labourer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Basic ground works and building' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'OTHER' && " +
              "@.previousWorkExperiences.experiences[1].experienceTypeOther == 'Entertainment industry' && " +
              "@.previousWorkExperiences.experiences[1].role == 'Nightclub DJ' && " +
              "@.previousWorkExperiences.experiences[1].details == 'Self employed DJ operating in bars and clubs' && " +
              '@.futureWorkInterests.interests.size() == 3 && ' +
              "@.futureWorkInterests.interests[0].workType == 'OUTDOOR' && " +
              "@.futureWorkInterests.interests[0].role == 'Farm hand' && " +
              "@.futureWorkInterests.interests[1].workType == 'DRIVING' && " +
              "@.futureWorkInterests.interests[1].role == 'Delivery driver' && " +
              "@.futureWorkInterests.interests[2].workType == 'OTHER' && " +
              "@.futureWorkInterests.interests[2].workTypeOther == 'Natural world' && " +
              "@.futureWorkInterests.interests[2].role == 'Botanist' && " +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 2 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'COMMUNITY' && " +
              "@.personalSkillsAndInterests.interests[1].interestType == 'DIGITAL' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'NONE' && " +
              '!@.workOnRelease.affectAbilityToWorkOther && ' +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'KITCHENS_AND_COOKING' && " +
              "@.inPrisonInterests.inPrisonWorkInterests[1].workType == 'PRISON_LIBRARY' && " +
              '@.inPrisonInterests.inPrisonTrainingInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'FORKLIFT_DRIVING' && " +
              "@.note == 'Induction went well' && " +
              `@.conductedAt == '${inductionConductedAtYear}-${inductionConductedAtMonth}-${inductionConductedAtDay}' && ` +
              "@.conductedBy == 'Joe Bloggs' && " +
              "@.conductedByRole == 'Peer Mentor'" +
              ')]',
          ),
        ),
    )
  })

  it('should create an Induction with no qualifications given prisoner has no previously recorded education', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetEducation404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    // When
    Page.verifyOnPage(OverviewPage) //
      .clickMakeProgressPlan()
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES) // Answer the question and submit the page
      .submitPage()

    // Future Work Interest Types page is next
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .selectWorkInterestType(WorkInterestTypeValue.OUTDOOR)
      .submitPage()

    // Future Work Interest Roles page is next, with a field for each work interest type
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-types')
      .setWorkInterestRole(WorkInterestTypeValue.OUTDOOR, 'Farm hand')
      .submitPage()

    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
      .selectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    // Highest level of education is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/affect-ability-to-work')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Want To Add Qualifications page is next
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .selectWantToAddQualifications(YesNoValue.NO)
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/want-to-add-qualifications')
      .selectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()

    // Previous Work Experience Types is the next page
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .submitPage()

    // Previous Work Experience Details page is next - once for each work industry type submitted on the previous page
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/previous-work-experience')
      .setJobRole('General labourer')
      .setJobDetails('Basic ground works and building')
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .selectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/skills')
      .selectPersonalInterest(PersonalInterestsValue.COMMUNITY)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .selectWorkType(InPrisonWorkValue.KITCHENS_AND_COOKING)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/in-prison-work')
      .selectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Who Completed Induction page is next
    Page.verifyOnPage(WhoCompletedInductionPage) //
      .selectWhoCompletedTheReview(SessionCompletedByValue.MYSELF)
      .setInductionDate(inductionConductedAtDay, inductionConductedAtMonth, inductionConductedAtYear)
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
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              "@.previousQualifications.educationLevel == 'FURTHER_EDUCATION_COLLEGE' && " +
              '@.previousQualifications.qualifications.size() == 0 && ' +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousWorkExperiences.hasWorkedBefore === 'YES' && " +
              '@.previousWorkExperiences.experiences.size() == 1 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'CONSTRUCTION' && " +
              "@.previousWorkExperiences.experiences[0].role == 'General labourer' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Basic ground works and building' && " +
              '@.futureWorkInterests.interests.size() == 1 && ' +
              "@.futureWorkInterests.interests[0].workType == 'OUTDOOR' && " +
              "@.futureWorkInterests.interests[0].role == 'Farm hand' && " +
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

  it('should create an induction with qualifications given prisoner already has previously recorded education', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)

    // Prisoner already has education recorded, consisting of:
    //  Highest Level of Education: SECONDARY_SCHOOL_TOOK_EXAMS
    //  Qualifications:
    //    Pottery, C, Level 4
    cy.task('stubGetEducation', { prisonNumber: prisonNumberForPrisonerWithNoInduction })

    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const hopingToWorkOnReleasePage = overviewPage //
      .clickMakeProgressPlan()
    hopingToWorkOnReleasePage //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .selectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    // Highest level of education is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasHighestLevelOfEducation(EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS) // expect value to already be set
      .submitPage() // submit the page without making any change

    // Qualifications List page is displayed next
    Page.verifyOnPage(QualificationsListPage) //
      .hasEducationalQualifications(['Pottery']) // expect Pottery qualification to already be set
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage) //
      .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage)
      .setQualificationSubject('Physics')
      .setQualificationGrade('B')
      .submitPage()

    // Qualifications List page is displayed again. Remove a qualification
    Page.verifyOnPage(QualificationsListPage) //
      .hasEducationalQualifications(['Pottery', 'Physics'])
      .submitPage()

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .selectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .selectWorkedBefore(HasWorkedBeforeValue.NO)
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .selectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()

    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .selectPersonalInterest(PersonalInterestsValue.DIGITAL)
      .submitPage()

    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .selectWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()

    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .selectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()

    // Who Completed Induction page is next
    Page.verifyOnPage(WhoCompletedInductionPage) //
      .selectWhoCompletedTheReview(SessionCompletedByValue.MYSELF)
      .setInductionDate(inductionConductedAtDay, inductionConductedAtMonth, inductionConductedAtYear)
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
              "@.previousQualifications.educationLevel == 'SECONDARY_SCHOOL_TOOK_EXAMS' && " +
              '@.previousQualifications.qualifications.size() == 2 && ' +
              '@.previousQualifications.qualifications[0].reference && ' + // assert the first qualification has a reference as it already exists in the prisoners previously recorded education
              "@.previousQualifications.qualifications[0].subject == 'Pottery' && " +
              "@.previousQualifications.qualifications[0].grade == 'C' && " +
              "@.previousQualifications.qualifications[0].level == 'LEVEL_4' && " +
              '!@.previousQualifications.qualifications[1].reference && ' + // assert the qualification has no reference as it is a new qualification that wont have a reference until the API has created it
              "@.previousQualifications.qualifications[1].subject == 'Physics' && " +
              "@.previousQualifications.qualifications[1].grade == 'B' && " +
              "@.previousQualifications.qualifications[1].level == 'LEVEL_4' && " +
              '@.previousTraining.trainingTypes.size() == 1 && ' +
              "@.previousTraining.trainingTypes[0] == 'HGV_LICENCE' && " +
              "@.previousWorkExperiences.hasWorkedBefore == 'NO' && " +
              '@.previousWorkExperiences.experiences.size() == 0 && ' +
              '@.futureWorkInterests.interests.size() == 0 && ' +
              '@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && " +
              '@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'DIGITAL' && " +
              '@.workOnRelease.affectAbilityToWork.size() == 1 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'NONE' && " +
              '!@.workOnRelease.affectAbilityToWorkOther && ' +
              '@.inPrisonInterests.inPrisonWorkInterests.size() == 1 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'PRISON_LIBRARY' && " +
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
