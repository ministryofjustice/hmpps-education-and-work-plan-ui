import { addDays, startOfToday } from 'date-fns'
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import ExemptionReasonPage from '../../pages/induction/ExemptionPage'
import ConfirmExemptionPage from '../../pages/induction/ConfirmExemptionPage'
import ExemptionRecordedPage from '../../pages/induction/ExemptionRecordedPage'
import InductionScheduleStatusValue from '../../../server/enums/inductionScheduleStatusValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Exempt an Induction', () => {
  const prisonNumberForPrisonerWithNoInduction = 'A00001A'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerAssessments', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerQualifications', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetEducation404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetActionPlanReviews404Error', prisonNumberForPrisonerWithNoInduction)
    // Set the prisoner's Induction to be scheduled in a few days from today
    cy.task('stubGetInductionSchedule', {
      prisonNumber: prisonNumberForPrisonerWithNoInduction,
      deadlineDate: addDays(startOfToday(), 3),
      scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
    })
    cy.task('stubUpdateInductionScheduleStatus')
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/induction/exemption`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should be able to navigate directly to Exemption page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/induction/exemption`)

    // Then
    Page.verifyOnPage(ExemptionReasonPage)
  })

  it('should mark the scheduled induction as exempt, triggering validation on every screen', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)
    Page.verifyOnPage(OverviewPage) //
      .inductionIsDue()
      .clickRecordInductionExemptionButton()

    // When
    Page.verifyOnPage(ExemptionReasonPage) //
      .submitPage() // submit the page without answering any questions to trigger exemption reason validation error
    Page.verifyOnPage(ExemptionReasonPage) //
      .hasErrorCount(1)
      .hasFieldInError('exemptionReason')
      .selectExemptionReason(InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(
        InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'a'.repeat(201),
      )
      .submitPage() // submit the page with too many characters in the exemption reason to trigger an exemption reason details validation error
    Page.verifyOnPage(ExemptionReasonPage) //
      .hasErrorCount(1)
      .hasFieldInError('EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY')
      .enterExemptionReasonDetails(
        InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'In treatment',
      )
      .submitPage() // submit the page with valid responses to redirect to confirm exemption page
    Page.verifyOnPage(ConfirmExemptionPage) //
      .submitPage()

    // Simulate the resultant InductionSchedule of a successful API call to have exempted the prisoner's Induction
    cy.task('stubGetInductionSchedule', {
      prisonNumber: prisonNumberForPrisonerWithNoInduction,
      deadlineDate: addDays(startOfToday(), 3),
      scheduleStatus: InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
    })

    Page.verifyOnPage(ExemptionRecordedPage) //
      .submitPage()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Exemption recorded')
      .inductionIsOnHold()

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}/induction-schedule`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.prisonId == 'BXI' && " +
              "@.status == 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY' && " +
              "@.exemptionReason == 'In treatment')]",
          ),
        ),
    )
  })

  it('should not mark the scheduled induction as exempt given cancel button is pressed', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)
    Page.verifyOnPage(OverviewPage) //
      .inductionIsDue()
      .clickRecordInductionExemptionButton()

    // When
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(
        InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'In treatment',
      )
      .submitPage() // submit the page with valid responses to redirect to confirm exemption page
    Page.verifyOnPage(ConfirmExemptionPage) //
      .goBackToLearningAndWorkProgressPlan()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .doesNotHaveSuccessMessage()
      .inductionIsDue()

    cy.wiremockVerifyNoInteractions(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}/induction-schedule`)),
    )
  })
})
