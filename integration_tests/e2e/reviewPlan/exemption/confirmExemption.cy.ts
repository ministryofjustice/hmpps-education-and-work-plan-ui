/**
 * Cypress tests that test the Confirm Review Exemption page
 */

import OverviewPage from '../../../pages/overview/OverviewPage'
import Page from '../../../pages/page'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'
import ExemptionRecordedPage from '../../../pages/reviewPlan/exemption/exemptionRecordedPage'

context(`Confirm review exemption page`, () => {
  const prisonNumber = 'G6115VJ'
  beforeEach(() => {
    cy.task('stubSignInAsUserWithEditAuthority')
  })

  it(`Should navigate to the 'Overview' page when 'No, go back to learning and work progress plan' button on 'Confirm review exemption' page is clicked`, () => {
    // Given
    cy.signIn()
    cy.createExemption()

    // When
    Page.verifyOnPage(ConfirmExemptionPage).goBackToLearningAndWorkProgressPlan()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .doesNotHaveSuccessMessage()
    Page.verifyOnPage(OverviewPage)
  })

  it(`should redirect to the 'Overview' page given user tries to navigate directly to 'Confirm review exemption' page - ie. navigate out of sequence`, () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/exemption/confirm`)

    // Then
    Page.verifyOnPage(OverviewPage)
  })

  it(`Should navigate to the 'Exemption recorded' page when 'Yes, continue to add exemption' button on 'Confirm review exemption' page is clicked`, () => {
    // Given
    cy.signIn()
    cy.createExemption()

    // When
    Page.verifyOnPage(ConfirmExemptionPage).submitPage()

    // Then
    Page.verifyOnPage(ExemptionRecordedPage)
  })
})
