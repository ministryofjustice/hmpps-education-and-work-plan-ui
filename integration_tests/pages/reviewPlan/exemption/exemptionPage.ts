import Page, { PageElement } from '../../page'
import ReviewPlanExemptionReasonValue from '../../../../server/enums/reviewPlanExemptionReasonValue'

/**
 * Cypress page class representing the "Exemption reason" page
 */
export default class ExemptionReasonPage extends Page {
  constructor() {
    super('review-plan-exemption-reason')
  }

  selectExemptionReason(value: ReviewPlanExemptionReasonValue): ExemptionReasonPage {
    this.radio(value).click()
    return this
  }

  clearExemptionReasonDetails(reason: string): ExemptionReasonPage {
    cy.get(`#${reason}`).clear()
    return this
  }

  typeExemptionReasonDetails(reason: string, details: string): ExemptionReasonPage {
    cy.get(`#${reason}`).type(details)
    return this
  }

  enterExemptionReasonDetails(reason: string, details: string): ExemptionReasonPage {
    this.clearExemptionReasonDetails(reason)
    this.typeExemptionReasonDetails(reason, details)
    return this
  }

  private radio = (value: ReviewPlanExemptionReasonValue): PageElement =>
    cy.get(`.govuk-radios__input[value='${value}']`)
}
