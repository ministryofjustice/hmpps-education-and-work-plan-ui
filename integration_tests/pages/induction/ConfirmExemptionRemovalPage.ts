import Page, { PageElement } from '../page'

export default class ConfirmExemptionRemovalPage extends Page {
  constructor() {
    super('confirm-remove-induction-exemption')
  }

  goBackToLearningAndWorkProgressPlan() {
    this.cancelButton().click()
    return this
  }

  private cancelButton = (): PageElement => cy.get('[data-qa=confirm-remove-exemption-cancel-button]')
}
