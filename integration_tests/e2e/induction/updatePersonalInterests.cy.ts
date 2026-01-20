import Page from '../../pages/page'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update Personal Interests in the Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update Personal Interests given page submitted with changed personal interests and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    const personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)

    // Induction has personal interests of Creative, Digital, Solo Activity, and Other (Car boot sales)

    // When
    personalInterestsPage //
      .deSelectPersonalInterest(PersonalInterestsValue.SOLO_ACTIVITIES)
      .deSelectPersonalInterest(PersonalInterestsValue.CREATIVE)
      .selectPersonalInterest(PersonalInterestsValue.SOCIAL)
      .selectPersonalInterest(PersonalInterestsValue.OTHER)
      .setOtherPersonalInterestType('Cryptocurrency')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.interests.size() == 3 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'DIGITAL' && !@.personalSkillsAndInterests.interests[0].interestTypeOther && " +
              "@.personalSkillsAndInterests.interests[1].interestType == 'SOCIAL' && !@.personalSkillsAndInterests.interests[1].interestTypeOther && " +
              "@.personalSkillsAndInterests.interests[2].interestType == 'OTHER' && @.personalSkillsAndInterests.interests[2].interestTypeOther == 'Cryptocurrency')]",
          ),
        ),
    )
  })

  it('should update Personal Interests given page submitted with changed personal interests values to NONE and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    const personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)

    // Induction has personal interests of Creative, Digital, Solo Activity, and Other (Car boot sales)

    // When
    personalInterestsPage //
      .selectPersonalInterest(PersonalInterestsValue.NONE)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.interests.size() == 1 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'NONE' && !@.personalSkillsAndInterests.interests[0].interestTypeOther)]",
          ),
        ),
    )
  })

  it('should not update Personal Interests given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    let personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)

    // When
    personalInterestsPage //
      .selectPersonalInterest(PersonalInterestsValue.OTHER)
      .clearOtherPersonalInterestType()
      .submitPage()

    // Then
    personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)
    personalInterestsPage.hasFieldInError('personalInterestsOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update personal interests given induction created with the original short question set that did not ask about personal interests', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetOriginalQuestionSetInduction', { questionSet: 'SHORT' }) // The original short question set Induction did not ask about personal interests
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    Page.verifyOnPage(WorkAndInterestsPage) //
      .personalInterestsChangeLinkHasText('Add')
      .clickPersonalInterestsChangeLink()

    // When
    Page.verifyOnPage(PersonalInterestsPage) //
      .selectPersonalInterest(PersonalInterestsValue.SOCIAL)
      .selectPersonalInterest(PersonalInterestsValue.OTHER)
      .setOtherPersonalInterestType('Cryptocurrency')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.interests.size() == 2 && ' +
              "@.personalSkillsAndInterests.interests[0].interestType == 'SOCIAL' && !@.personalSkillsAndInterests.interests[0].interestTypeOther && " +
              "@.personalSkillsAndInterests.interests[1].interestType == 'OTHER' && @.personalSkillsAndInterests.interests[1].interestTypeOther == 'Cryptocurrency')]",
          ),
        ),
    )
  })
})
