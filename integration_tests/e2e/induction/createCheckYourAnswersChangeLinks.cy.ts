/**
 * Cypress tests that test the Change links on the Check Your Answers page when creating an Induction
 */
import { sub } from 'date-fns'
import { startOfToday } from 'date-fns/startOfToday'
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
import QualificationLevelPage from '../../pages/prePrisonEducation/QualificationLevelPage'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationDetailsPage from '../../pages/prePrisonEducation/QualificationDetailsPage'
import QualificationsListPage from '../../pages/prePrisonEducation/QualificationsListPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import SessionCompletedByValue from '../../../server/enums/sessionCompletedByValue'

context(`Change links on the Check Your Answers page when creating an Induction`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
  })

  it('should support all Change links on the Check Your Answers page when creating an Induction with all options', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({
      prisonNumber,
      hasWorkedBefore: HasWorkedBeforeValue.YES,
      hopingToGetWork: HopingToGetWorkValue.YES,
      withQualifications: true,
    })
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    // Change in-prison training interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickInPrisonTrainingInterestsChangeLink()
      .deSelectInPrisonTraining(InPrisonTrainingValue.FORKLIFT_DRIVING)
      .selectInPrisonTraining(InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING)
      .selectInPrisonTraining(InPrisonTrainingValue.RUNNING_A_BUSINESS)
      .submitPage()

    // Change in-prison work interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickInPrisonWorkInterestsChangeLink()
      .deSelectWorkType(InPrisonWorkValue.PRISON_LIBRARY)
      .selectWorkType(InPrisonWorkValue.MAINTENANCE)
      .selectWorkType(InPrisonWorkValue.TEXTILES_AND_SEWING)
      .submitPage()

    // Change affecting ability to work
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickFactorsAffectingAbilityToWorkChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectAffectAbilityToWork(AbilityToWorkValue.NONE)
      .selectAffectAbilityToWork(AbilityToWorkValue.LIMITED_BY_OFFENCE)
      .selectAffectAbilityToWork(AbilityToWorkValue.NO_RIGHT_TO_WORK)
      .submitPage()

    // Change personal interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickPersonalInterestsChangeLink()
      .deSelectPersonalInterest(PersonalInterestsValue.COMMUNITY)
      .selectPersonalInterest(PersonalInterestsValue.CRAFTS)
      .selectPersonalInterest(PersonalInterestsValue.DIGITAL)
      .submitPage()

    // Change skills
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickPersonalSkillsChangeLink()
      .deSelectSkill(SkillsValue.POSITIVE_ATTITUDE)
      .selectSkill(SkillsValue.TEAMWORK)
      .selectSkill(SkillsValue.RESILIENCE)
      .submitPage()

    // Change Other Training
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickAdditionalTrainingChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .selectAdditionalTraining(AdditionalTrainingValue.MANUAL_HANDLING)
      .selectAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .submitPage()

    // Change work interests
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickWorkInterestsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .deSelectWorkInterestType(WorkInterestTypeValue.DRIVING)
      .selectWorkInterestType(WorkInterestTypeValue.MANUFACTURING)
      .selectWorkInterestType(WorkInterestTypeValue.OUTDOOR)
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

    // Change the previous work experience types which will show the user a work experience detail page for each work experience (inc. existing ones)
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickWorkExperienceTypesChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.BEAUTY)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.DRIVING)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) // Job details page for "construction" - assert existing values are still there but make no changes to them
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
      .hasJobRole('Building site manager')
      .hasJobDetails('Organising building works and hiring of casual labour')
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage) // Job details page for "driving"
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`)
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
      .selectWorkedBefore(HasWorkedBeforeValue.NO)
      .submitPage()
    // Change worked before from No to Yes, which means the user is taken through the journey to add work experiences
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasWorkedBefore(HasWorkedBeforeValue.NO) // expect the value to now be No
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.SPORTS)
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

    // Change Induction Completed By
    const inductionConductedAt = sub(startOfToday(), { days: 2 })
    const inductionConductedAtDay = `${inductionConductedAt.getDate()}`.padStart(2, '0')
    const inductionConductedAtMonth = `${inductionConductedAt.getMonth() + 1}`.padStart(2, '0')
    const inductionConductedAtYear = `${inductionConductedAt.getFullYear()}`
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickInductionCompletedByChangeLink()
      .selectWhoCompletedTheReview(SessionCompletedByValue.SOMEBODY_ELSE)
      .enterFullName('Michelangelo di Lodovico Buonarroti Simoni')
      .enterJobRole('Italian sculptor, painter, architect, and poet')
      .setInductionDate(inductionConductedAtDay, inductionConductedAtMonth, inductionConductedAtYear)
      .submitPage()

    // Change Induction Notes
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickInductionNotesChangeLink()
      .setInductionNote('Induction went well and prisoner is looking forward to learning about Renaissance art')
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.YES)
      .hasFactorsAffectingAbilityToWork([AbilityToWorkValue.LIMITED_BY_OFFENCE, AbilityToWorkValue.NO_RIGHT_TO_WORK])
      .hasPersonalInterest(PersonalInterestsValue.CRAFTS)
      .hasPersonalInterest(PersonalInterestsValue.DIGITAL)
      .hasPersonalSkill(SkillsValue.TEAMWORK)
      .hasPersonalSkill(SkillsValue.RESILIENCE)
      .hasAdditionalTraining([AdditionalTrainingValue.MANUAL_HANDLING, AdditionalTrainingValue.CSCS_CARD])
      .hasWorkInterest(WorkInterestTypeValue.OUTDOOR)
      .hasWorkInterest(WorkInterestTypeValue.MANUFACTURING)
      .hasWorkedBefore(HasWorkedBeforeValue.YES)
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
      .hasNoEducationalQualificationsDisplayed()
      .hasInPrisonWorkInterests([InPrisonWorkValue.MAINTENANCE, InPrisonWorkValue.TEXTILES_AND_SEWING])
      .hasInPrisonTrainingInterests([
        InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING,
        InPrisonTrainingValue.RUNNING_A_BUSINESS,
      ])
      .hasInductionCompletedBy(
        'Michelangelo di Lodovico Buonarroti Simoni',
        'Italian sculptor, painter, architect, and poet',
      )
      .hasInductionCompletedOn(inductionConductedAt)
      .hasInductionNotes('Induction went well and prisoner is looking forward to learning about Renaissance art')
  })

  it('should support changing Hoping To Work from No to Yes', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, hopingToGetWork: HopingToGetWorkValue.NO })
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.NO)
      .clickHopingToWorkOnReleaseChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()

    Page.verifyOnPage(FutureWorkInterestTypesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`)
      .selectWorkInterestType(WorkInterestTypeValue.MANUFACTURING)
      .selectWorkInterestType(WorkInterestTypeValue.OUTDOOR)
      .submitPage()

    Page.verifyOnPage(FutureWorkInterestRolesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/work-interest-types`)
      .setWorkInterestRole(WorkInterestTypeValue.MANUFACTURING, 'Welder')
      .setWorkInterestRole(WorkInterestTypeValue.OUTDOOR, 'Gardener')
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.YES)
      .hasWorkInterest(WorkInterestTypeValue.OUTDOOR)
      .hasWorkInterest(WorkInterestTypeValue.MANUFACTURING)
  })

  it('should support changing Hoping To Work from Yes to No', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, hopingToGetWork: HopingToGetWorkValue.YES })
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.YES)
      .clickHopingToWorkOnReleaseChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.NO)
  })

  it('should support changing has worked before from Yes to Not relevant and back to Yes', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, hasWorkedBefore: HasWorkedBeforeValue.YES })
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    // Change worked before (changing Yes to Not relevant which will return the user to Check Your Answers)
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT)
      .setNotRelevantReason(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      .submitPage()
    // Change worked before from Not relevant to Yes, which means the user is taken through the journey to add work experiences
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT) // expect the value to now be Not relevant
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.SPORTS)
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

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasWorkedBefore(HasWorkedBeforeValue.YES)
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

  it('should support changing has worked before from Yes to Not relevant', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, hasWorkedBefore: HasWorkedBeforeValue.YES })
    Page.verifyOnPage(CheckYourAnswersPage)

    // When
    // Change worked before (changing Yes to Not relevant which will return the user to Check Your Answers)
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickHasWorkedBeforeChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT)
      .setNotRelevantReason(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT)
      .hasWorkedBeforeNotRelevantReason(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
  })

  it('should remove all qualifications', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, withQualifications: true })
    // Induction has 1 qualification at this point
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasEducationalQualificationsDisplayed()

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .removeQualification(1)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasWantsToAddQualificationsAs(YesNoValue.NO)
      .hasNoEducationalQualificationsDisplayed()
  })

  it('should start the qualifications mini-flow for an Induction with no qualifications when Do They Want To Add Qualifications is changed to Yes', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({ prisonNumber, withQualifications: false })
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasWantsToAddQualificationsAs(YesNoValue.NO) // Induction starts off with no qualifications
      .hasNoEducationalQualificationsDisplayed()

    // When
    Page.verifyOnPage(CheckYourAnswersPage) //
      .clickWantsToAddQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      .selectWantToAddQualifications(YesNoValue.YES)
      .submitPage()

    Page.verifyOnPage(QualificationLevelPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`)
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

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasEducationalQualifications(['Chemistry'])
  })
})
