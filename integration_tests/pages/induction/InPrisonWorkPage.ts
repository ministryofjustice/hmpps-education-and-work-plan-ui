import Page, { PageElement } from '../page'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'

/**
 * Cypress page class representing the Induction "In Prison Work" page
 */
export default class InPrisonWorkPage extends Page {
  constructor() {
    super('induction-in-prison-work')
  }

  chooseWorkType(option: InPrisonWorkValue): InPrisonWorkPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectWorkType(option: InPrisonWorkValue): InPrisonWorkPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setOtherWorkType(value: string): InPrisonWorkPage {
    this.otherWorkTypeField().clear().type(value)
    return this
  }

  clearOtherWorkType(): InPrisonWorkPage {
    this.otherWorkTypeField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  checkbox = (option: InPrisonWorkValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  otherWorkTypeField = (): PageElement => cy.get('#inPrisonWorkOther')

  submitButton = (): PageElement => cy.get('#submit-button')
}