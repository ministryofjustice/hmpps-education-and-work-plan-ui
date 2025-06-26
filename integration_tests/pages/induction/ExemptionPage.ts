import Page, { PageElement } from '../page'
import InductionExemptionReasonValue from '../../../server/enums/inductionExemptionReasonValue'

/**
 * Cypress page class representing the "Induction Exemption reason" page
 */
export default class ExemptionReasonPage extends Page {
  constructor() {
    super('induction-exemption-reason')
  }

  selectExemptionReason(value: InductionExemptionReasonValue): ExemptionReasonPage {
    this.radio(value).click()
    return this
  }

  clearExemptionReasonDetails(reason: string): ExemptionReasonPage {
    cy.get(`#${reason}`).clear()
    return this
  }

  typeExemptionReasonDetails(reason: string, details: string): ExemptionReasonPage {
    cy.get(`#${reason}`).type(details, { delay: 0 })
    return this
  }

  enterExemptionReasonDetails(reason: string, details: string): ExemptionReasonPage {
    this.clearExemptionReasonDetails(reason)
    this.typeExemptionReasonDetails(reason, details)
    return this
  }

  private radio = (value: InductionExemptionReasonValue): PageElement =>
    cy.get(`.govuk-radios__input[value='${value}']`)
}
