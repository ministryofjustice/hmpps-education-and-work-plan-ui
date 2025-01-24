import Page, { PageElement } from '../../page'
/**
 * Cypress page class representing the "Confirm exemption" page
 */
export default class ConfirmExemptionPage extends Page {
  constructor() {
    super('confirm-exemption')
  }

  goBackToLearningAndWorkProgressPlan() {
    this.cancelButton().click()
    return this
  }

  private cancelButton = (): PageElement => cy.get('[data-qa=confirm-exemption-cancel-button]')
}
