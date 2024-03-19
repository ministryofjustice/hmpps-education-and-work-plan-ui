import Page from '../../pages/page'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update reasons not to get work within an Induction', () => {
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
    cy.task('stubGetInductionShortQuestionSet')
    cy.signIn()
  })

  it('should update reasons not to get work given page submitted with changed values and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
    const reasonsNotToGetWorkPage = Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    reasonsNotToGetWorkPage //
      .deSelectReasonNotToGetWork(ReasonNotToGetWorkValue.LIMIT_THEIR_ABILITY)
      .deSelectReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.OTHER)
      .setReasonsNotToGetWorkOther('Variable mental health')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.workOnRelease.notHopingToWorkReasons.size() == 2 && ' +
              "@.workOnRelease.notHopingToWorkReasons[0] == 'HEALTH' && " +
              "@.workOnRelease.notHopingToWorkReasons[1] == 'OTHER' && " +
              "@.workOnRelease.notHopingToWorkOtherReason == 'Variable mental health')]",
          ),
        ),
    )
  })

  it('should update reasons not to get work given page submitted with values changed to NOT_SURE and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
    const reasonsNotToGetWorkPage = Page.verifyOnPage(ReasonsNotToGetWorkPage)

    // When
    reasonsNotToGetWorkPage //
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.NOT_SURE)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.notHopingToWorkReasons.size() == 1 && @.workOnRelease.notHopingToWorkReasons[0] == 'NOT_SURE')]",
          ),
        ),
    )
  })

  it('should not update reasons not to get work given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
    let reasonsNotToGetWorkPage = Page.verifyOnPage(ReasonsNotToGetWorkPage)

    // When
    reasonsNotToGetWorkPage //
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.OTHER)
      .clearReasonsNotToGetWorkOther()
      .submitPage()

    // Then
    reasonsNotToGetWorkPage = Page.verifyOnPage(ReasonsNotToGetWorkPage)
    reasonsNotToGetWorkPage.hasFieldInError('reasonsNotToGetWorkOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })
})
