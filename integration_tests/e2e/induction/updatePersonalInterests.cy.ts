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
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInductionLongQuestionSet')
    cy.signIn()
  })

  it('should update Personal Interests given page submitted with changed personal interests and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/personal-interests`)
    const personalInterestsPage = Page.verifyOnPage(PersonalInterestsPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // stubGetInductionLongQuestionSet has personal interests of Creative, Digital, Solo Activity, and Other (Car boot sales)

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

    // stubGetInductionLongQuestionSet has personal interests of Creative, Digital, Solo Activity, and Other (Car boot sales)

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

  it('should update personal interests given short question set induction that was created with no personal interests', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetInductionShortQuestionSetCreatedWithOriginalQuestionSet') // The original question set did not ask about personal interests for the Short question set
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
