import Page from '../../pages/page'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

context('Update whether a prisoner has worked before in an Induction', () => {
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
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update Worked Before to No given page submitted with changed value and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(HasWorkedBeforeValue.NO)

    workedBeforePage //
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(matchingJsonPath(`$[?(@.previousWorkExperiences.hasWorkedBefore == 'NO')]`)),
    )
  })

  it('should update Worked Before to Not relevant given page submitted with changed value and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT)
      .setNotRelevantReason(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousWorkExperiences.hasWorkedBefore == 'NOT_RELEVANT' && " +
              "@.previousWorkExperiences.hasWorkedBeforeNotRelevantReason == 'Chris feels his previous work experience is not relevant as he is not planning on working upon release.')]",
          ),
        ),
    )
  })
})
