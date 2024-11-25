import { startOfToday } from 'date-fns/startOfToday'
import { RequestPatternBuilder } from '../mockApis/wiremock/requestPatternBuilder'
import { verify } from '../mockApis/wiremock'
import Page from '../pages/page'
import HopingToWorkOnReleasePage from '../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from '../pages/prePrisonEducation/QualificationsListPage'
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
import HighestLevelOfEducationPage from '../pages/prePrisonEducation/HighestLevelOfEducationPage'
import EducationLevelValue from '../../server/enums/educationLevelValue'
import QualificationLevelPage from '../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../pages/prePrisonEducation/QualificationDetailsPage'
import AdditionalTrainingValue from '../../server/enums/additionalTrainingValue'
import WantToAddQualificationsPage from '../pages/prePrisonEducation/WantToAddQualificationsPage'
import HasWorkedBeforeValue from '../../server/enums/hasWorkedBeforeValue'
import WhoCompletedReviewPage from '../pages/reviewPlan/WhoCompletedReviewPage'
import ReviewPlanCompletedByValue from '../../server/enums/reviewPlanCompletedByValue'
import ReviewNotePage from '../pages/reviewPlan/ReviewNotePage'
import ReviewPlanCheckYourAnswersPage from '../pages/reviewPlan/ReviewPlanCheckYourAnswersPage'
import ExemptionReasonPage from '../pages/reviewPlan/exemption/exemptionPage'
import ReviewPlanExemptionReasonValue from '../../server/enums/reviewPlanExemptionReasonValue'
import ConfirmExemptionPage from '../pages/reviewPlan/exemption/confirmExemptionPage'

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

Cypress.Commands.add(
  'createInductionToArriveOnCheckYourAnswers',
  (options?: {
    prisonNumber?: string
    hopingToGetWork?: HopingToGetWorkValue
    hasWorkedBefore?: HasWorkedBeforeValue
    withQualifications?: boolean
  }) => {
    const addQualificationsToInduction =
      !options ||
      options.withQualifications === null ||
      options.withQualifications === undefined ||
      options.withQualifications === true

    cy.task('stubGetEducation404Error', options?.prisonNumber || 'G6115VJ')
    /* Create an Induction by answering all the questions to get to the Check Your Answers page. */
    cy.visit(`/prisoners/${options?.prisonNumber || 'G6115VJ'}/create-induction/hoping-to-work-on-release`)

    // Hoping To Work On Release is the first page
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .selectHopingWorkOnRelease(options?.hopingToGetWork || HopingToGetWorkValue.YES)
      .submitPage()
    if (!options || !options.hopingToGetWork || options.hopingToGetWork === HopingToGetWorkValue.YES) {
      // Future Work Interest Types page is next
      Page.verifyOnPage(FutureWorkInterestTypesPage) //
        .selectWorkInterestType(WorkInterestTypeValue.DRIVING)
        .submitPage()
      // Future Work Interest Roles page is next
      Page.verifyOnPage(FutureWorkInterestRolesPage) //
        .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Delivery driver')
        .submitPage()
    }
    // Factors Affecting Ability To Work is the next page
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .selectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()
    // Highest Level of Education page is next
    Page.verifyOnPage(HighestLevelOfEducationPage)
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()
    // Want To Add Qualifications is the next page
    Page.verifyOnPage(WantToAddQualificationsPage) //
      .selectWantToAddQualifications(addQualificationsToInduction ? YesNoValue.YES : YesNoValue.NO)
      .submitPage()

    if (addQualificationsToInduction) {
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
      .selectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .submitPage()
    // Have You Worked Before page is next
    Page.verifyOnPage(WorkedBeforePage) //
      .selectWorkedBefore(options?.hasWorkedBefore || HasWorkedBeforeValue.YES)
      .submitPage()
    if (!options || !options.hasWorkedBefore || options.hasWorkedBefore === HasWorkedBeforeValue.YES) {
      // Previous Work Experience Types is the next page
      Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
        .selectPreviousWorkExperience(TypeOfWorkExperienceValue.CONSTRUCTION)
        .submitPage()
      // Previous Work Experience Details page is next
      Page.verifyOnPage(PreviousWorkExperienceDetailPage) //
        .setJobRole('General labourer')
        .setJobDetails('Basic ground works and building')
        .submitPage()
    }
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
      .selectWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()
    // In Prison Training Interests page is next
    Page.verifyOnPage(InPrisonTrainingPage) //
      .selectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .submitPage()
    // Arrive on Check Your Answers page
    Page.verifyOnPage(CheckYourAnswersPage)
  },
)

Cypress.Commands.add('createReviewToArriveOnCheckYourAnswers', () => {
  cy.visit(`/plan/G6115VJ/review`)

  const today = startOfToday()

  // When
  // First page is the Who completed the review page
  Page.verifyOnPage(WhoCompletedReviewPage) //
    .setReviewDate(`${today.getDate()}`, `${today.getMonth() + 1}`, `${today.getFullYear()}`)
    .selectWhoCompletedTheReview(ReviewPlanCompletedByValue.SOMEBODY_ELSE)
    .enterReviewersFullName('A Reviewer')
    .enterReviewersJobRole('CIAG')
    .submitPage()

  // Next page is Review Notes page
  Page.verifyOnPage(ReviewNotePage)
    .setReviewNote(
      `Daniel's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Daniel well and is allowing him to focus on more productive uses of his time whilst in prison.

We have agreed and set a new goal, and the next review is 1 year from now.   
`,
    )
    .submitPage()
  // Arrive on Check Your Answers page
  Page.verifyOnPage(ReviewPlanCheckYourAnswersPage)
})

Cypress.Commands.add('createExemption', () => {
  cy.visit(`/plan/G6115VJ/review/exemption`)

  Page.verifyOnPage(ExemptionReasonPage) //
    .selectExemptionReason(ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
    .enterExemptionReasonDetails(
      ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
      'In treatment',
    )
    .submitPage()

  Page.verifyOnPage(ConfirmExemptionPage)
})

const signInWithAuthority = (authority: 'EDIT' | 'VIEW') => {
  cy.task('reset')
  cy.task(authority === 'EDIT' ? 'stubSignInAsUserWithEditAuthority' : 'stubSignInAsReadOnlyUser')
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
