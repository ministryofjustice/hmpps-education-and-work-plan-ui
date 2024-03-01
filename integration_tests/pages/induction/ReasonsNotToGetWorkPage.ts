import Page, { PageElement } from '../page'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'

/**
 * Cypress page class representing the Induction "Reasons Not To Get Work" page
 */
export default class ReasonsNotToGetWorkPage extends Page {
  constructor() {
    super('induction-reasons-not-to-work')
  }

  chooseReasonNotToGetWork(option: ReasonNotToGetWorkValue): ReasonsNotToGetWorkPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectReasonNotToGetWork(option: ReasonNotToGetWorkValue): ReasonsNotToGetWorkPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setReasonsNotToGetWorkOther(value: string): ReasonsNotToGetWorkPage {
    this.reasonsNotToGetWorkOtherField().clear().type(value)
    return this
  }

  clearReasonsNotToGetWorkOther(): ReasonsNotToGetWorkPage {
    this.reasonsNotToGetWorkOtherField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  checkbox = (option: ReasonNotToGetWorkValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  reasonsNotToGetWorkOtherField = (): PageElement => cy.get('#reasonsNotToGetWorkOther')

  submitButton = (): PageElement => cy.get('#submit-button')
}
