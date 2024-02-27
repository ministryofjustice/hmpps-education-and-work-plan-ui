import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

/**
 * Cypress page class representing the "Has Worked Before" Page.
 */
export default class WorkedBeforePage extends Page {
  constructor() {
    super('induction-has-worked-before')
  }

  selectWorkedBefore(value: YesNoValue): WorkedBeforePage {
    this.radio(value).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
