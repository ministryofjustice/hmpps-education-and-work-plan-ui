/**
 * Cypress tests that test the 'Exemption recorded' page
 */

import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'
import ExemptionRecordedPage from '../../../pages/reviewPlan/exemption/exemptionRecordedPage'

context(`Review exemption recorded page`, () => {
  const prisonNumber = 'G6115VJ'
  beforeEach(() => {
    cy.task('stubSignInAsUserWithEditAuthority')
  })

  it(`Should navigate to the 'Overview' page when 'Continue' button is clicked`, () => {
    // Given
    cy.signIn()
    cy.createExemption()

    // When
    Page.verifyOnPage(ConfirmExemptionPage).submitPage()
    Page.verifyOnPage(ExemptionRecordedPage).submitPage()

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it(`should redirect to the 'Overview' page given user tries to navigate directly to 'Review exemption recorded' page - ie. navigate out of sequence`, () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/exemption/recorded`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })
})
