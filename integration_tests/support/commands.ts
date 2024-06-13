import { RequestPatternBuilder } from '../mockApis/wiremock/requestPatternBuilder'
import { verify } from '../mockApis/wiremock'
import Page from '../pages/page'
import HopingToWorkOnReleasePage from '../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../server/enums/hopingToGetWorkValue'
import ReasonsNotToGetWorkPage from '../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../server/enums/reasonNotToGetWorkValue'
import QualificationsListPage from '../pages/induction/QualificationsListPage'
import AdditionalTrainingPage from '../pages/induction/AdditionalTrainingPage'
import InPrisonWorkPage from '../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../server/enums/inPrisonWorkValue'
import InPrisonTrainingPage from '../pages/induction/InPrisonTrainingPage'
import InPrisonTrainingValue from '../../server/enums/inPrisonTrainingValue'
import CheckYourAnswersPage from '../pages/induction/CheckYourAnswersPage'
import WorkedBeforePage from '../pages/induction/WorkedBeforePage'
import YesNoValue from '../../server/enums/yesNoValue'
import PreviousWorkExperienceTypesPage from '../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../pages/induction/PreviousWorkExperienceDetailPage'
import FutureWorkInterestTypesPage from '../pages/induction/FutureWorkInterestTypesPage'
import WorkInterestTypeValue from '../../server/enums/workInterestTypeValue'
import FutureWorkInterestRolesPage from '../pages/induction/FutureWorkInterestRolesPage'
import SkillsPage from '../pages/induction/SkillsPage'
import SkillsValue from '../../server/enums/skillsValue'
import PersonalInterestsPage from '../pages/induction/PersonalInterestsPage'
import PersonalInterestsValue from '../../server/enums/personalInterestsValue'
import AffectAbilityToWorkPage from '../pages/induction/AffectAbilityToWorkPage'
import AbilityToWorkValue from '../../server/enums/abilityToWorkValue'
import PrisonerListPage from '../pages/prisonerList/PrisonerListPage'
import HighestLevelOfEducationPage from '../pages/induction/HighestLevelOfEducationPage'
import EducationLevelValue from '../../server/enums/educationLevelValue'
import QualificationLevelPage from '../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../pages/induction/QualificationDetailsPage'
import AdditionalTrainingValue from '../../server/enums/additionalTrainingValue'
import WantToAddQualificationsPage from '../pages/induction/WantToAddQualificationsPage'
import HasWorkedBeforeValue from '../../server/enums/hasWorkedBeforeValue'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: false }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('signOut', () => {
  return cy.visit('/sign-out')
})

Cypress.Commands.add('wiremockVerify', (requestPatternBuilder: RequestPatternBuilder, expectedCount?: number) => {
  return cy.wrap(verify(expectedCount == null ? 1 : expectedCount, requestPatternBuilder)).should('be.true')
})

Cypress.Commands.add('wiremockVerifyNoInteractions', (requestPatternBuilder: RequestPatternBuilder) => {
  return cy.wrap(verify(0, requestPatternBuilder)).should('be.true')
})

Cypress.Commands.add('signInAsUserWithViewAuthorityToArriveOnPrisonerListPage', () => {
  signInWithAuthority('VIEW')
})

Cypress.Commands.add('signInAsUserWithEditAuthorityToArriveOnPrisonerListPage', () => {
  signInWithAuthority('EDIT')
})

Cypress.Commands.add('updateShortQuestionSetInductionToArriveOnCheckYourAnswers', (prisonNumber = 'G6115VJ') => {
  /* Update a Long Question Set Induction by answering the Do They Want To Work On Release question to NO to turn it
   * into a Short Question Set Induction. Answer all the questions to get to the Check Your Answers page.
   */
  cy.task('stubGetInductionLongQuestionSet') // Long question set Induction with Hoping to work on release as YES
  cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
  // Hoping To Work On Release is the first page
  Page.verifyOnPage(HopingToWorkOnReleasePage) //
    .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
    .submitPage()
  // Reasons Not To Work is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(ReasonsNotToGetWorkPage) //
    .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
    .submitPage()
  // Highest Level of Education page is next. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(HighestLevelOfEducationPage) //
    .submitPage()
  // Want To Add Qualifications is the next page. Qualifications are asked on the long question set, so this will already have qualifications set
  Page.verifyOnPage(WantToAddQualificationsPage) //
    .submitPage()
  Page.verifyOnPage(QualificationLevelPage) //
    .selectQualificationLevel(QualificationLevelValue.ENTRY_LEVEL)
    .submitPage()
  Page.verifyOnPage(QualificationDetailsPage)
    .setQualificationSubject('Basic reading')
    .setQualificationGrade('Pass')
    .submitPage()
  // Qualifications List is the next page. Remove the qualification just added
  Page.verifyOnPage(QualificationsListPage) //
    .removeQualification(5)
    .submitPage()
  // Additional Training is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage) //
    .submitPage()
  // 'Has the prisoner worked before' is the next page. This is asked on the long question set so will have answers but
  // we will make a change to exercise the screen flow
  Page.verifyOnPage(WorkedBeforePage) //
    .submitPage()
  // Remove office and other, and select
  Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
    .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
    .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OTHER)
    .choosePreviousWorkExperience(TypeOfWorkExperienceValue.WAREHOUSING)
    .submitPage()
  Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
    .setJobRole('Forklift driver')
    .setJobDetails('Stacking shelves with a forklift')
    .submitPage()
  // Personal Skills page is next. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(SkillsPage) //
    .submitPage()
  // Personal Interests page is next. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(PersonalInterestsPage) //
    .submitPage()
  // In Prison Work Interests is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(InPrisonWorkPage) //
    .submitPage()
  // In Prison Training Interests is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(InPrisonTrainingPage) //
    .submitPage()
  // Arrive on Check Your Answers page
  Page.verifyOnPage(CheckYourAnswersPage)
})

Cypress.Commands.add('updateLongQuestionSetInductionToArriveOnCheckYourAnswers', (prisonNumber = 'G6115VJ') => {
  /* Update a Short Question Set Induction by answering the Do They Want To Work On Release question to YES to turn it
   * into a Long Question Set Induction. Answer all the questions to get to the Check Your Answers page.
   */
  cy.task('stubGetInductionShortQuestionSet') // Short question set Induction with Hoping to work on release as NO
  cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
  // Hoping To Work On Release is the first page
  Page.verifyOnPage(HopingToWorkOnReleasePage) //
    .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
    .submitPage()
  // Work Interests page is the next page. This is not asked on the short question set.
  Page.verifyOnPage(FutureWorkInterestTypesPage) //
    .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
    .submitPage()
  Page.verifyOnPage(FutureWorkInterestRolesPage) //
    .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Driving instructor')
    .submitPage()
  // Highest Level of Education page is next. This is asked on the short question set, so this will already have answers set
  Page.verifyOnPage(HighestLevelOfEducationPage) //
    .submitPage()
  // Want To Add Qualifications is the next page. Qualifications are asked on the short question set, so this will already have qualifications set
  Page.verifyOnPage(WantToAddQualificationsPage) //
    .submitPage()
  Page.verifyOnPage(QualificationLevelPage) //
    .selectQualificationLevel(QualificationLevelValue.ENTRY_LEVEL)
    .submitPage()
  Page.verifyOnPage(QualificationDetailsPage)
    .setQualificationSubject('Basic reading')
    .setQualificationGrade('Pass')
    .submitPage()
  // Qualifications List is the next page. Remove the qualification just added
  Page.verifyOnPage(QualificationsListPage) //
    .removeQualification(2)
    .submitPage()
  // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage) //
    .submitPage()
  // 'Has the prisoner worked before' is the next page. This is asked on the short question set so will have answers but
  // we will make a change to exercise the screen flow
  Page.verifyOnPage(WorkedBeforePage) //
    .selectWorkedBefore(HasWorkedBeforeValue.YES)
    .submitPage()
  // Remove office and other, and select
  Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
    .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
    .deSelectPreviousWorkExperience(TypeOfWorkExperienceValue.OTHER)
    .choosePreviousWorkExperience(TypeOfWorkExperienceValue.WAREHOUSING)
    .submitPage()
  Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
    .setJobRole('Forklift driver')
    .setJobDetails('Stacking shelves with a forklift')
    .submitPage()
  // Personal skills page is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(SkillsPage) //
    .submitPage()
  // Personal Interests is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(PersonalInterestsPage) //
    .submitPage()
  // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
  Page.verifyOnPage(AffectAbilityToWorkPage) //
    .chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES)
    .submitPage()
  // In Prison Work Interests is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(InPrisonWorkPage) //
    .submitPage()
  // In Prison Training Interests is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(InPrisonTrainingPage) //
    .submitPage()
  // Arrive on Check Your Answers page
  Page.verifyOnPage(CheckYourAnswersPage)
})

Cypress.Commands.add(
  'createLongQuestionSetInductionToArriveOnCheckYourAnswers',
  (prisonNumber = 'G6115VJ', withQualifications = true) => {
    /* Create a Long Question Set Induction by answering all the questions to get to the Check Your Answers page. */
    cy.visit(`/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`)

    // Hoping To Work On Release is the first page
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()
    // Future Work Interest Types page is next
    Page.verifyOnPage(FutureWorkInterestTypesPage) //
      .chooseWorkInterestType(WorkInterestTypeValue.DRIVING)
      .submitPage()
    // Future Work Interest Roles page is next
    Page.verifyOnPage(FutureWorkInterestRolesPage) //
      .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Delivery driver')
      .submitPage()
    // Highest Level of Education page is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()
    // Want To Add Qualifications is the next page
    Page.verifyOnPage(WantToAddQualificationsPage) //
      .selectWantToAddQualifications(withQualifications ? YesNoValue.YES : YesNoValue.NO)
      .submitPage()

    if (withQualifications) {
      // Qualification Level page is next
      Page.verifyOnPage(QualificationLevelPage) //
        .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
        .submitPage()
      // Qualification Detail page is next
      Page.verifyOnPage(QualificationDetailsPage) //
        .setQualificationSubject('Computer science')
        .setQualificationGrade('A*')
        .submitPage()
      // Qualifications List page is again. Submit the page using its main CTA to move forward to the next screen
      Page.verifyOnPage(QualificationsListPage) //
        .submitPage()
    }

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()
    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()
    // Previous Work Experience Types is the next page
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .submitPage()
    // Previous Work Experience Details page is next
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .setJobRole('General labourer')
      .setJobDetails('Basic ground works and building')
      .submitPage()
    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .chooseSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()
    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .choosePersonalInterest(PersonalInterestsValue.COMMUNITY)
      .submitPage()
    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .chooseAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()
    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .chooseWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()
    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .chooseInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()
    // Arrive on Check Your Answers page
    Page.verifyOnPage(CheckYourAnswersPage)
  },
)

Cypress.Commands.add(
  'createShortQuestionSetInductionToArriveOnCheckYourAnswers',
  (prisonNumber = 'G6115VJ', withQualifications = true) => {
    /* Create a Short Question Set Induction by answering all the questions to get to the Check Your Answers page. */
    cy.visit(`/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`)

    // Hoping To Work On Release is the first page
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()
    // Reasons Not To Get Work is the next page
    Page.verifyOnPage(ReasonsNotToGetWorkPage) //
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.FULL_TIME_CARER)
      .submitPage()
    // Highest Level of Education page is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()
    // Want To Add Qualifications is the next page
    Page.verifyOnPage(WantToAddQualificationsPage) //
      .selectWantToAddQualifications(withQualifications ? YesNoValue.YES : YesNoValue.NO)
      .submitPage()

    if (withQualifications) {
      // Qualification Level page is next
      Page.verifyOnPage(QualificationLevelPage) //
        .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
        .submitPage()
      // Qualification Detail page is next
      Page.verifyOnPage(QualificationDetailsPage) //
        .setQualificationSubject('Computer science')
        .setQualificationGrade('A*')
        .submitPage()
      // Qualifications List page is again. Submit the page using its main CTA to move forward to the next screen
      Page.verifyOnPage(QualificationsListPage) //
        .submitPage()
    }

    // Additional Training page is next
    Page.verifyOnPage(AdditionalTrainingPage) //
      .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()
    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()
    // Previous Work Experience Types is the next page
    Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
      .submitPage()
    // Previous Work Experience Details page is next
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
      .setJobRole('General labourer')
      .setJobDetails('Basic ground works and building')
      .submitPage()
    // Personal Skills page is next
    Page.verifyOnPage(SkillsPage) //
      .chooseSkill(SkillsValue.POSITIVE_ATTITUDE)
      .submitPage()
    // Personal Interests page is next
    Page.verifyOnPage(PersonalInterestsPage) //
      .choosePersonalInterest(PersonalInterestsValue.COMMUNITY)
      .submitPage()
    // In Prison Work Interests page is next
    Page.verifyOnPage(InPrisonWorkPage) //
      .chooseWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()
    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .chooseInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()
    // Arrive on Check Your Answers page
    Page.verifyOnPage(CheckYourAnswersPage)
  },
)

const signInWithAuthority = (authority: 'EDIT' | 'VIEW') => {
  cy.task('reset')
  cy.task(authority === 'EDIT' ? 'stubSignInAsUserWithEditAuthority' : 'stubSignInAsUserWithViewAuthority')
  cy.task('stubAuthUser')
  cy.task('stubGetHeaderComponent')
  cy.task('stubGetFooterComponent')
  cy.task('stubPrisonerList')
  cy.task('stubCiagInductionList')
  cy.task('stubActionPlansList')
  cy.task('getPrisonerById')
  cy.task('stubLearnerProfile')
  cy.signIn()
  Page.verifyOnPage(PrisonerListPage)
}
