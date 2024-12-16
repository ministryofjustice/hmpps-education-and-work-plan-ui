/**
 * Cypress tests that test the Confirm Review Exemption page
 */

import { startOfDay } from 'date-fns'
import ReviewScheduleStatusValue from '../../../../server/enums/reviewScheduleStatusValue'
import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'
import ExemptionReasonPage from '../../../pages/reviewPlan/exemption/exemptionPage'
import ExemptionRecordedPage from '../../../pages/reviewPlan/exemption/exemptionRecordedPage'

context(`Confirm review exemption page`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('stubUpdateActionPlanReviewScheduleStatus')
    cy.task('stubGetActionPlanReviews')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review/exemption`)
  })

  it(`Should navigate to the 'Overview' page when 'No, go back to learning and work progress plan' button on Confirm review exemption page is clicked`, () => {
    // Given
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY, 'In treatment')
      .submitPage()

    // When
    const confirmExemptionPage = Page.verifyOnPage(ConfirmExemptionPage)

    // Then
    confirmExemptionPage.goBackToLearningAndWorkProgressPlan()
    Page.verifyOnPage(OverviewPage) //
      .doesNotHaveSuccessMessage()
  })

  it(`Should navigate to the 'Exemption recorded' page when 'Yes' button on Confirm review exemption page is clicked, and the exception reason was not system technical issue`, () => {
    // Given
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY, 'In treatment')
      .submitPage()

    // When
    const confirmExemptionPage = Page.verifyOnPage(ConfirmExemptionPage)

    // Then
    confirmExemptionPage.submitPage()
    Page.verifyOnPage(ExemptionRecordedPage) //
      .reviewIsOnHold()
  })

  it(`Should navigate to the 'Exemption recorded' page when 'Yes' button on Confirm review exemption page is clicked, and the exception reason was system technical issue`, () => {
    // Given
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE)
      .enterExemptionReasonDetails(
        ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
        'Power outage on site, lost all internet access',
      )
      .submitPage()

    // When
    const confirmExemptionPage = Page.verifyOnPage(ConfirmExemptionPage)

    // Then
    confirmExemptionPage.submitPage()
    Page.verifyOnPage(ExemptionRecordedPage) //
      .reviewHasNewDeadlineDateOf(startOfDay('2024-10-15'))
  })
})
