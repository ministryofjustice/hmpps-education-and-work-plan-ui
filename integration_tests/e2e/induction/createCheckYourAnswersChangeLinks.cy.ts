/**
 * Cypress tests that test the Change links on the Check Your Answers page when creating an Induction
 */
import Page from '../../pages/page'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import SkillsValue from '../../../server/enums/skillsValue'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import YesNoValue from '../../../server/enums/yesNoValue'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'

context(`Change links on the Check Your Answers page when creating an Induction`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should support all Change links on a Long Question Set Induction', () => {
    // Given
    cy.createLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber)
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    // Change affecting ability to work
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickFactorsAffectingAbilityToWorkChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .chooseAffectAbilityToWork(AbilityToWorkValue.LIMITED_BY_OFFENSE)
      .chooseAffectAbilityToWork(AbilityToWorkValue.NO_RIGHT_TO_WORK)
      .submitPage()

    // Change personal interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickPersonalInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectPersonalInterest(PersonalInterestsValue.COMMUNITY)
      .choosePersonalInterest(PersonalInterestsValue.CRAFTS)
      .choosePersonalInterest(PersonalInterestsValue.DIGITAL)
      .submitPage()

    // Change skills
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickPersonalSkillsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .chooseSkill(SkillsValue.TEAMWORK)
      .chooseSkill(SkillsValue.RESILIENCE)
      .submitPage()

    // Change Other Training
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickAdditionalTrainingChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .chooseAdditionalTraining(AdditionalTrainingValue.MANUAL_HANDLING)
      .chooseAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .submitPage()

    // Change work interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickWorkInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectWorkInterestType(WorkInterestTypeValue.DRIVING)
      .chooseWorkInterestType(WorkInterestTypeValue.MANUFACTURING)
      .chooseWorkInterestType(WorkInterestTypeValue.OUTDOOR)
      .submitPage()

    // Change work interest roles
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickParticularJobInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .setWorkInterestRole(WorkInterestTypeValue.MANUFACTURING, 'Welder')
      .setWorkInterestRole(WorkInterestTypeValue.OUTDOOR, 'Gardener')
      .submitPage()

    // Change a previous work experience that has already been added to the Induction
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickWorkExperienceDetailChangeLink(TypeOfWorkExperienceValue.CONSTRUCTION)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .setJobRole('Building site manager')
      .setJobDetails('Organising building works and hiring of casual labour')
      .submitPage()

    // Change the previous work experience types which will show the user a work experience detail page for each new work experience
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickWorkExperienceTypesChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.BEAUTY)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.DRIVING)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) // Job details page for "driving"
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
      .setJobRole('Driving instructor')
      .setJobDetails('Teaching customers to drive')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) // Job details page for "beauty"
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience/driving`)
      .setJobRole('Nail technician')
      .setJobDetails('Greeting customers and performing manicures')
      .submitPage()

    // Change worked before (changing Yes to No which will return the user to Check Your Answers)
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(YesNoValue.NO)
      .submitPage()
    // Change worked before from No to Yes, which means the user is taken through the journey to add work experiences
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasWorkedBefore(YesNoValue.NO) // expect the value to now be No
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(YesNoValue.YES)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .choosePreviousWorkExperience(TypeOfWorkExperienceValue.SPORTS)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
      .setJobRole('Office junior')
      .setJobDetails('Filing and photocopying: Sept 2000 - Dec 2009')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience/office`)
      .setJobRole('Gym instructor')
      .setJobDetails('Coaching and motivating customers fitness goals')
      .submitPage()

    // Change Highest Level of Education
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickHighestLevelOfEducationLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectHighestLevelOfEducation(EducationLevelValue.UNDERGRADUATE_DEGREE_AT_UNIVERSITY)
      .submitPage()

    // Change Educational Qualifications - add 1 qualification
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/qualifications`)
      .selectQualificationLevel(QualificationLevelValue.LEVEL_1)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      .setQualificationSubject('Chemistry')
      .setQualificationGrade('Merit')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .submitPage()

    // Change Educational Qualifications - remove all remaining qualifications
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .removeQualification(2) // The induction now has 2 qualifications on it. Remove them all
      .removeQualification(1)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.YES)
      .hasFactorsAffectingAbilityToWork(AbilityToWorkValue.LIMITED_BY_OFFENSE)
      .hasFactorsAffectingAbilityToWork(AbilityToWorkValue.NO_RIGHT_TO_WORK)
      .hasPersonalInterest(PersonalInterestsValue.CRAFTS)
      .hasPersonalInterest(PersonalInterestsValue.DIGITAL)
      .hasPersonalSkill(SkillsValue.TEAMWORK)
      .hasPersonalSkill(SkillsValue.RESILIENCE)
      .hasAdditionalTraining([AdditionalTrainingValue.MANUAL_HANDLING, AdditionalTrainingValue.CSCS_CARD])
      .hasWorkInterest(WorkInterestTypeValue.OUTDOOR)
      .hasWorkInterest(WorkInterestTypeValue.MANUFACTURING)
      .hasWorkedBefore(YesNoValue.YES)
      .hasWorkExperience(
        TypeOfWorkExperienceValue.OFFICE,
        'Office junior',
        'Filing and photocopying: Sept 2000 - Dec 2009',
      )
      .hasWorkExperience(
        TypeOfWorkExperienceValue.SPORTS,
        'Gym instructor',
        'Coaching and motivating customers fitness goals',
      )
  })
})
