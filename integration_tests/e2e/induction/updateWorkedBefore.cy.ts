import Page from '../../pages/page'
import YesNoValue from '../../../server/enums/yesNoValue'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

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
    cy.task('stubGetInductionLongQuestionSet')
    cy.signIn()
  })

  it('should update Worked Before given page submitted with changed value and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(YesNoValue.NO)

    workedBeforePage //
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(matchingJsonPath(`$[?(@.previousWorkExperiences.hasWorkedBefore == false)]`)),
    )
  })
})
