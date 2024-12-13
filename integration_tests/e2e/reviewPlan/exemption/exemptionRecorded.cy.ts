/**
 * Cypress tests that test the 'Exemption recorded' page
 */

import ReviewScheduleStatusValue from '../../../../server/enums/reviewScheduleStatusValue'
import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'
import ExemptionReasonPage from '../../../pages/reviewPlan/exemption/exemptionPage'
import ExemptionRecordedPage from '../../../pages/reviewPlan/exemption/exemptionRecordedPage'

context(`Review exemption recorded page`, () => {
  const prisonNumber = 'G6115VJ'

  it(`Should navigate to the 'Overview' page when 'Continue' button is clicked`, () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review/exemption`)

    // When
    Page.verifyOnPage(ExemptionReasonPage) //
      .selectExemptionReason(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY, 'In treatment')
      .submitPage()
    Page.verifyOnPage(ConfirmExemptionPage).submitPage()

    // Then
    Page.verifyOnPage(ExemptionRecordedPage).submitPage()
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Exemption recorded')
  })
})
