import InductionPage from './InductionPage'
import { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

/**
 * Cypress page class representing the Induction "Do you want to add educational qualifications" page
 */
export default class WantToAddQualificationsPage extends InductionPage {
  constructor() {
    super('induction-want-to-add-educational-qualifications')
  }

  selectHopingWorkOnRelease(value: YesNoValue): WantToAddQualificationsPage {
    this.radio(value).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
