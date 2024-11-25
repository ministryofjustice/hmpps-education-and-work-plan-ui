/**
 * Cypress tests that test the Confirm Review Exemption page
 */

import ReviewPlanExemptionReasonValue from '../../../../server/enums/reviewPlanExemptionReasonValue'
import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'
import ExemptionReasonPage from '../../../pages/reviewPlan/exemption/exemptionPage'
import ExemptionRecordedPage from '../../../pages/reviewPlan/exemption/exemptionRecordedPage'

context(`Confirm review exemption page`, () => {
  const prisonNumber = 'G6115VJ'
  beforeEach(() => {
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review/exemption`)
  })

  it(`Should navigate to the 'Overview' page when 'No, go back to learning and work progress plan' button on Confirm review exemption page is clicked`, () => {
    // Given
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(
        ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'In treatment',
      )
      .submitPage()

    // When
    const confirmExemptionPage = Page.verifyOnPage(ConfirmExemptionPage)

    // Then
    confirmExemptionPage.goBackToLearningAndWorkProgressPlan()
    Page.verifyOnPage(OverviewPage) //
      .doesNotHaveSuccessMessage()
  })

  it(`Should navigate to the 'Exemption recorded' page when 'Yes, continue to add exemption' button on Confirm review exemption page is clicked`, () => {
    // Given
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(
        ReviewPlanExemptionReasonValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'In treatment',
      )
      .submitPage()

    // When
    const confirmExemptionPage = Page.verifyOnPage(ConfirmExemptionPage)

    // Then
    confirmExemptionPage.submitPage()
    Page.verifyOnPage(ExemptionRecordedPage)
  })
})
