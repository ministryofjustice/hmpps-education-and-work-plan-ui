import { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the "Has Worked Before" Page.
 */
export default class WorkedBeforePage extends InductionPage {
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
