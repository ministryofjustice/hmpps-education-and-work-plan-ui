import { addDays, startOfToday } from 'date-fns'
import InductionScheduleStatusValue from '../../../server/enums/inductionScheduleStatusValue'
import Page from '../../pages/page'
import AuthorisationErrorPage from '../../pages/authorisationError'
import ConfirmExemptionRemovalPage from '../../pages/induction/ConfirmExemptionRemovalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import ExemptionRemovedPage from '../../pages/induction/ExemptionRemovedPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Remove exemption from Induction', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan404Error', prisonNumber)
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubLearnerProfile', prisonNumber)
    cy.task('stubLearnerQualifications', prisonNumber)
    cy.task('stubGetInduction404Error', prisonNumber)
    cy.task('stubGetEducation404Error', prisonNumber)
    cy.task('stubGetActionPlanReviews404Error', prisonNumber)
    // Set the prisoner's Induction to be exempted
    cy.task('stubGetInductionSchedule', {
      prisonNumber,
      deadlineDate: addDays(startOfToday(), 3),
      scheduleStatus: InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
    })
    cy.task('stubUpdateInductionScheduleStatus')
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/induction/exemption/remove`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should be able to navigate directly to Remove Exemption page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumber}/induction/exemption/remove`)

    // Then
    Page.verifyOnPage(ConfirmExemptionRemovalPage)
  })

  it('should remove the exemption on a previously exempted induction session', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    Page.verifyOnPage(OverviewPage) //
      .inductionIsOnHold()
      .clickRemoveInductionExemptionButton()

    // Simulate the resultant InductionSchedule of a successful API call to remove the exemption from the prisoner's Induction
    cy.task('stubGetInductionSchedule', {
      prisonNumber,
      deadlineDate: addDays(startOfToday(), 10),
      scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
    })

    // When
    Page.verifyOnPage(ConfirmExemptionRemovalPage) //
      .submitPage()
    Page.verifyOnPage(ExemptionRemovedPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Exemption removed')
      .inductionIsDue()

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}/induction-schedule`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.prisonId == 'BXI' && " + //
              "@.status == 'SCHEDULED' && " + //
              '!@.exemptionReason)]',
          ),
        ),
    )
  })

  it('should not remove the exemption on a previously exempted induction session given cancel button is pressed', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    Page.verifyOnPage(OverviewPage) //
      .inductionIsOnHold()
      .clickRemoveInductionExemptionButton()

    // When
    Page.verifyOnPage(ConfirmExemptionRemovalPage) //
      .goBackToLearningAndWorkProgressPlan()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .doesNotHaveSuccessMessage()
      .inductionIsOnHold()

    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}/induction-schedule`)))
  })
})
