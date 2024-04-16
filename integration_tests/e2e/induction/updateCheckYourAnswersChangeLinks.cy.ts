/**
 * Cypress tests that test the Change links on the Check Your Answers page when updating an Induction
 */
import Page from '../../pages/page'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
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

context(`Change links on the Check Your Answers page when updating an Induction`, () => {
  const prisonNumber = 'G6115VJ'

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
    cy.task('stubLearnerProfile')
    cy.signIn()
  })

  it('should support all Change links on a Short Question Set Induction', () => {
    // Given
    const checkYourAnswersPage = checkYourAnswersPageForAShortQuestionSetInduction()

    // When
    // Change Hoping To Work On Release
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickHopingToWorkOnReleaseChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NOT_SURE)
      .submitPage()

    // Change Reasons For Not Wanting To Work
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickReasonsForNotWantingToWorkChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .deSelectReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.RETIRED)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.NO_REASON)
      .submitPage()

    // Change Other Training
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickAdditionalTrainingChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .deSelectAdditionalTraining(AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE)
      .deSelectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .deSelectAdditionalTraining(AdditionalTrainingValue.OTHER)
      .chooseAdditionalTraining(AdditionalTrainingValue.MANUAL_HANDLING)
      .chooseAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .submitPage()

    // Change In Prison Work Interests
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickInPrisonWorkInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .deSelectWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .chooseWorkType(InPrisonWorkValue.PRISON_LAUNDRY)
      .chooseWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .submitPage()

    // Change In Prison Training Interests
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickInPrisonTrainingInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .deSelectInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
      .chooseInPrisonTraining(InPrisonTrainingValue.CATERING)
      .chooseInPrisonTraining(InPrisonTrainingValue.NUMERACY_SKILLS)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.NOT_SURE)
      .hasReasonsForNotWantingToWork([ReasonNotToGetWorkValue.RETIRED, ReasonNotToGetWorkValue.NO_REASON])
      .hasAdditionalTraining([AdditionalTrainingValue.MANUAL_HANDLING, AdditionalTrainingValue.CSCS_CARD])
      .hasInPrisonWorkInterests([InPrisonWorkValue.PRISON_LAUNDRY, InPrisonWorkValue.PRISON_LIBRARY])
      .hasInPrisonTrainingInterests([InPrisonTrainingValue.CATERING, InPrisonTrainingValue.NUMERACY_SKILLS])
  })

  // TODO - RR-736 Implement this test
  it.skip('should support all Change links on a Long Question Set Induction', () => {
    // Given
    const checkYourAnswersPage = checkYourAnswersPageForALongQuestionSetInduction() // eslint-disable-line @typescript-eslint/no-unused-vars

    // When

    // Then
  })
})

const checkYourAnswersPageForAShortQuestionSetInduction = (prisonNumber = 'G6115VJ'): CheckYourAnswersPage => {
  /* Update a Long Question Set Induction by answering the Do They Want To Work On Release question to NO to turn it
   * into a Short Question Set Induction. Answer all the questions to get to the Check Your Answers page.
   */
  cy.task('stubGetInductionLongQuestionSet') // Long question set Induction with Hoping to work on release as YES
  cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
  // Hoping To Work On Release is the first page
  Page.verifyOnPage(HopingToWorkOnReleasePage).selectHopingWorkOnRelease(HopingToGetWorkValue.NO).submitPage()
  // Reasons Not To Work is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(ReasonsNotToGetWorkPage).chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH).submitPage()
  // Qualifications List is the next page. Qualifications are asked on the long question set, so this will already have qualifications set
  Page.verifyOnPage(QualificationsListPage).submitPage()
  // Additional Training is the next page. This is asked on the long question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage).submitPage()
  // In Prison Work Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(InPrisonWorkPage) //
    .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
    .submitPage()
  // In Prison Training Interests is the next page, and is only asked on the short question set, so will not have any previous answer from the original long question set Induction
  Page.verifyOnPage(InPrisonTrainingPage) //
    .chooseInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
    .submitPage()
  // Arrive on Check Your Answers page
  return Page.verifyOnPage(CheckYourAnswersPage)
}

const checkYourAnswersPageForALongQuestionSetInduction = (prisonNumber = 'G6115VJ'): CheckYourAnswersPage => {
  /* Update a Short Question Set Induction by answering the Do They Want To Work On Release question to YES to turn it
   * into a Long Question Set Induction. Answer all the questions to get to the Check Your Answers page.
   */
  cy.task('stubGetInductionShortQuestionSet') // Long question set Induction with Hoping to work on release as YES
  cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
  // Hoping To Work On Release is the first page
  Page.verifyOnPage(HopingToWorkOnReleasePage).selectHopingWorkOnRelease(HopingToGetWorkValue.YES).submitPage()
  // Qualifications List is the next page. Qualifications are asked on the short question set, so this will already have qualifications set
  Page.verifyOnPage(QualificationsListPage).submitPage()
  // Additional Training is the next page. This is asked on the short question set, so this will already have answers set
  Page.verifyOnPage(AdditionalTrainingPage).submitPage()
  // 'Has the prisoner worked before' is the next page. This is not asked on the short question set.
  // Answer 'Yes' to create an Induction that has details of the prisoners previous work experience.
  Page.verifyOnPage(WorkedBeforePage) //
    .selectWorkedBefore(YesNoValue.YES)
    .submitPage()
  // Preview Work Experience types is the next page. This is not asked on the short question set.
  Page.verifyOnPage(PreviousWorkExperienceTypesPage) //
    .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
    .submitPage()
  Page.verifyOnPage(PreviousWorkExperienceDetailPage)
    .setJobRole('Office junior')
    .setJobDetails('Filing and photocopying')
    .submitPage()
  // Work Interests page is the next page. This is not asked on the short question set.
  Page.verifyOnPage(FutureWorkInterestTypesPage).chooseWorkInterestType(WorkInterestTypeValue.DRIVING).submitPage()
  Page.verifyOnPage(FutureWorkInterestRolesPage)
    .setWorkInterestRole(WorkInterestTypeValue.DRIVING, 'Driving instructor')
    .submitPage()
  // Personal skills page is the next page. This is not asked on the short question set.
  Page.verifyOnPage(SkillsPage).chooseSkill(SkillsValue.TEAMWORK).submitPage()
  // Personal Interests is the next page. This is not asked on the short question set.
  Page.verifyOnPage(PersonalInterestsPage).choosePersonalInterest(PersonalInterestsValue.SOCIAL).submitPage()
  // Factors Affecting Ability To Work is the next page. This is not asked on the short question set.
  Page.verifyOnPage(AffectAbilityToWorkPage).chooseAffectAbilityToWork(AbilityToWorkValue.HEALTH_ISSUES).submitPage()
  // Arrive on Check Your Answers page
  return Page.verifyOnPage(CheckYourAnswersPage)
}
