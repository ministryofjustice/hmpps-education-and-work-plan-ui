import Page, { PageElement } from '../page'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'

/**
 * Cypress page class representing the Induction "Future Work Interest Types" page
 */
export default class FutureWorkInterestTypesPage extends Page {
  constructor() {
    super('induction-future-work-interest-types')
  }

  chooseWorkInterestType(option: WorkInterestTypeValue): FutureWorkInterestTypesPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectWorkInterestType(option: WorkInterestTypeValue): FutureWorkInterestTypesPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setWorkInterestTypesOther(value: string): FutureWorkInterestTypesPage {
    this.workInterestTypesOtherField().clear().type(value)
    return this
  }

  clearWorkInterestTypesOther(): FutureWorkInterestTypesPage {
    this.workInterestTypesOtherField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  checkbox = (option: WorkInterestTypeValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  workInterestTypesOtherField = (): PageElement => cy.get('#workInterestTypesOther')

  submitButton = (): PageElement => cy.get('#submit-button')
}
