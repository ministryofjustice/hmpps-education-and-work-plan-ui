import Page, { PageElement } from '../page'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'

/**
 * Cypress page class representing the "Qualification Level" page
 */
export default class QualificationLevelPage extends Page {
  constructor() {
    super('qualification-level')
  }

  selectQualificationLevel(value: QualificationLevelValue): QualificationLevelPage {
    this.radio(value).click()
    return this
  }

  radio = (value: QualificationLevelValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
