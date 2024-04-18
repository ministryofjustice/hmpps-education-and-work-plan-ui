/**
 * Cypress tests that test the Change links on the Check Your Answers page when updating an Induction
 */
import Page from '../../pages/page'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import QualificationLevelPage from '../../pages/induction/QualificationLevelPage'
import QualificationDetailsPage from '../../pages/induction/QualificationDetailsPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'
import EducationLevelValue from '../../../server/enums/educationLevelValue'

context(`Change links on the Check Your Answers page when updating an Induction`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should support all Change links on a Short Question Set Induction', () => {
    // Given
    cy.updateShortQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber)
    const checkYourAnswersPage = Page.verifyOnPage(CheckYourAnswersPage)

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

    // Change Educational Qualifications - remove 1 qualification
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .removeQualification(2) // The original induction has 4 qualifications on it. Remove the 2nd one
      .submitPage()
    // Change Educational Qualifications - add 1 qualification
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage) //
      .selectQualificationLevel(QualificationLevelValue.LEVEL_1)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage) //
      .setQualificationSubject('Chemistry')
      .setQualificationGrade('Merit')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .submitPage()
    // Back on Check Your Answers we can check we have the correct qualifications
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasEducationalQualifications(['French', 'Maths', 'English', 'Chemistry'])
    // Change Educational Qualifications - remove all remaining qualifications
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .removeQualification(4) // The induction now has 4 qualifications on it. Remove them all
      .removeQualification(3)
      .removeQualification(2)
      .removeQualification(1)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHopingToWorkOnRelease(HopingToGetWorkValue.NOT_SURE)
      .hasReasonsForNotWantingToWork([ReasonNotToGetWorkValue.RETIRED, ReasonNotToGetWorkValue.NO_REASON])
      .hasAdditionalTraining([AdditionalTrainingValue.MANUAL_HANDLING, AdditionalTrainingValue.CSCS_CARD])
      .hasInPrisonWorkInterests([InPrisonWorkValue.PRISON_LAUNDRY, InPrisonWorkValue.PRISON_LIBRARY])
      .hasInPrisonTrainingInterests([InPrisonTrainingValue.CATERING, InPrisonTrainingValue.NUMERACY_SKILLS])
      .hasNoEducationalQualificationsDisplayed()
  })

  /* TODO - RR-736 finish the implementation of this test by clicking all Change links:
   * Hoping To Work On Release (perhaps not do this one as it will turn the induction back into a short question set!)
   * Educational Qualifications - Done
   * Highest Level of Education - Done
   * Other Training
   * Worked Before
   * Work history
   * Type of work interested in
   * Particular job roles
   * Personal Skills
   * Personal Interests
   * Factors affecting ability to work
   */
  it('should support all Change links on a Long Question Set Induction', () => {
    // Given
    cy.updateLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber)
    const checkYourAnswersPage = Page.verifyOnPage(CheckYourAnswersPage) // eslint-disable-line @typescript-eslint/no-unused-vars

    // When
    // Change Highest Level of Education
    Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswersPage
      .clickHighestLevelOfEducationLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .selectHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .submitPage()
    // Change Educational Qualifications - add 1 qualification
    Page.verifyOnPage(CheckYourAnswersPage)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .clickToAddAnotherQualification()
    Page.verifyOnPage(QualificationLevelPage) //
      .selectQualificationLevel(QualificationLevelValue.LEVEL_1)
      .submitPage()
    Page.verifyOnPage(QualificationDetailsPage) //
      .setQualificationSubject('Chemistry')
      .setQualificationGrade('Merit')
      .submitPage()
    Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .submitPage()
    // Change Educational Qualifications - remove all remaining qualifications
    Page.verifyOnPage(CheckYourAnswersPage)
      .hasHighestLevelOfEducation(EducationLevelValue.FURTHER_EDUCATION_COLLEGE)
      .clickQualificationsChangeLink()
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      .removeQualification(2) // The induction now has 2 qualifications on it. Remove them all
      .removeQualification(1)
      .submitPage()

    // Then
    Page.verifyOnPage(CheckYourAnswersPage) //
      .hasHighestLevelOfEducation(EducationLevelValue.NOT_SURE) // Highest level of education is NOT_SURE because we removed all the qualifications
      .hasNoEducationalQualificationsDisplayed()
  })
})
