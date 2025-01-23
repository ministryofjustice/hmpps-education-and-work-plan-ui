import Page, { PageElement } from '../page'
/**
 * Cypress page class representing the "Confirm induction exemption" page
 */
export default class ConfirmExemptionPage extends Page {
  constructor() {
    super('confirm-induction-exemption')
  }

  goBackToLearningAndWorkProgressPlan() {
    this.backButton().click()
    return this
  }

  private backButton = (): PageElement => cy.get('[data-qa=confirm-exemption-back-button]')
}
