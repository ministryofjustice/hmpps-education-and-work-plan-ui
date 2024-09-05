import Page, { PageElement } from '../page'
import YesNoValue from '../../../server/enums/yesNoValue'

/**
 * Cypress page class representing the "Do you want to add educational qualifications" page
 */
export default class WantToAddQualificationsPage extends Page {
  constructor() {
    super('want-to-add-educational-qualifications')
  }

  selectWantToAddQualifications(value: YesNoValue): WantToAddQualificationsPage {
    this.radio(value).click()
    return this
  }

  radio = (value: YesNoValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
