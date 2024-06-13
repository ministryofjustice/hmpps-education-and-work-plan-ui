import { PageElement } from '../page'
import InductionPage from './InductionPage'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

/**
 * Cypress page class representing the "Has Worked Before" Page.
 */
export default class WorkedBeforePage extends InductionPage {
  constructor() {
    super('induction-has-worked-before')
  }

  selectWorkedBefore(value: HasWorkedBeforeValue): WorkedBeforePage {
    this.radio(value).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  radio = (value: HasWorkedBeforeValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
