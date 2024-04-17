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
    cy.updateLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber)
    const checkYourAnswersPage = Page.verifyOnPage(CheckYourAnswersPage) // eslint-disable-line @typescript-eslint/no-unused-vars

    // When

    // Then
  })
})
