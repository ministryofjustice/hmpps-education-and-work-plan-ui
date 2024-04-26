import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
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
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'

context('Create a long question set Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should create a long question set Induction', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
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

    // Qualifications List page is next
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .hasNoEducationalQualificationsDisplayed()
      .submitPage() // Submit page - there are no other CTAs at this point as there are Qualifications currently recorded.
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/qualifications')
      .hasErrorCount(1)
      .hasFieldInError('educationLevel')
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()

    // Qualification Level page is next
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(QualificationLevelPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/highest-level-of-education')
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

    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(WorkedBeforePage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/additional-training')
      .hasErrorCount(1)
      .hasFieldInError('hasWorkedBefore')
      .selectWorkedBefore(YesNoValue.YES)
      .submitPage()

    // Post-release Work Interest Types is the next page
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

    // Post-release Work Interest Details page is next - once for each work industry type submitted on the previous page
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

    // Future Work Interest Types page is next
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/has-worked-before')
      .hasErrorCount(1)
      .hasFieldInError('workInterestTypes')
      .chooseWorkInterestType(WorkInterestTypeValue.OUTDOOR)
      .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
      .chooseWorkInterestType(WorkInterestTypeValue.OTHER)
      .setWorkInterestTypesOther('Natural world')
      .submitPage()

    // Future Work Interest Roles page is next, with a field for each work interest type
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-types')
      .setWorkInterestRole(WorkInterestTypeValue.OUTDOOR, 'Farm hand')
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Delivery driver')
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Botanist')
      .submitPage()

    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(SkillsPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/work-interest-roles')
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

    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/personal-interests')
      .hasErrorCount(1)
      .hasFieldInError('affectAbilityToWork')
      .chooseAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    // Check Your Answers is the last page
    Page.verifyOnPage(CheckYourAnswersPage)

    // Then
  })
})
