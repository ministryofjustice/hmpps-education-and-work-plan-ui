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
  // Qualifications List is the next page. Qualifications are asked on the long question set, so this will already have qualifications set
  Page.verifyOnPage(QualificationsListPage) //
    .submitPage()
  // Additional Training is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage) //
    .submitPage()
  // In Prison Work Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(InPrisonWorkPage) //
    .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
    .submitPage()
  // In Prison Training Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(InPrisonTrainingPage) //
    .chooseInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
    .submitPage()
  // Arrive on Check Your Answers page
  Page.verifyOnPage(CheckYourAnswersPage)
})

Cypress.Commands.add('updateLongQuestionSetInductionToArriveOnCheckYourAnswers', (prisonNumber = 'G6115VJ') => {
  /* Update a Short Question Set Induction by answering the Do They Want To Work On Release question to YES to turn it
   * into a Long Question Set Induction. Answer all the questions to get to the Check Your Answers page.
   */
  cy.task('stubGetInductionShortQuestionSet') // Long question set Induction with Hoping to work on release as YES
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
  // Qualifications List is the next page. Qualifications are asked on the short question set, so this will already have qualifications set
  Page.verifyOnPage(QualificationsListPage) //
    .submitPage()
  // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage) //
    .submitPage()
  // 'Has the prisoner worked before' is the next page. This is not asked on the short question set.
  // Answer 'Yes' to create an Induction that has details of the prisoners previous work experience.
  Page.verifyOnPage(WorkedBeforePage) //
    .selectWorkedBefore(YesNoValue.YES)
    .submitPage()
  // Previous Work Experience types is the next page. This is not asked on the short question set.
  Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
    .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
    .submitPage()
  Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
    .setJobRole('Office junior')
    .setJobDetails('Filing and photocopying')
    .submitPage()
  // Personal skills page is the next page. This is not asked on the short question set.
  Page.verifyOnPage(SkillsPage) //
    .chooseSkill(SkillsValue.TEAMWORK)
    .submitPage()
  // Personal Interests is the next page. This is not asked on the short question set.
  Page.verifyOnPage(PersonalInterestsPage) //
    .choosePersonalInterest(PersonalInterestsValue.SOCIAL)
    .submitPage()
  // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
  Page.verifyOnPage(AffectAbilityToWorkPage) //
    .chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES)
    .submitPage()
  // Arrive on Check Your Answers page
  Page.verifyOnPage(CheckYourAnswersPage)
})

Cypress.Commands.add('createLongQuestionSetInductionToArriveOnCheckYourAnswers', (prisonNumber = 'G6115VJ') => {
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
  // Qualifications List page is next
  Page.verifyOnPage(QualificationsListPage) //
    .submitPage() // Submit page - there are no other CTAs at this point as there are Qualifications currently recorded.
  Page.verifyOnPage(HighestLevelOfEducationPage)
    .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
    .submitPage()
  // Qualification Level page is next
  Page.verifyOnPage(QualificationLevelPage) //
    .selectQualificationLevel(QualificationLevelValue.LEVEL_4)
    .submitPage()
  // Qualification Detail page is next
  Page.verifyOnPage(QualificationDetailsPage) //
    .setQualificationSubject('Computer science')
    .setQualificationGrade('A*')
    .submitPage()
  // Qualifications List page is displayed again. Submit the page using its main CTA to move forward to the next screen
  Page.verifyOnPage(QualificationsListPage) //
    .submitPage()
  // Additional Training page is next
  Page.verifyOnPage(AdditionalTrainingPage) //
    .chooseAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
    .submitPage()
  // Have You Worked Before page is next
  Page.verifyOnPage(WorkedBeforePage) //
    .selectWorkedBefore(YesNoValue.YES)
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
  // Arrive on Check Your Answers page
  Page.verifyOnPage(CheckYourAnswersPage)
})

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
