import { PageElement } from '../page'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Qualification Level" page
 */
export default class QualificationLevelPage extends InductionPage {
  constructor() {
    super('induction-qualification-level')
  }

  selectQualificationLevel(value: QualificationLevelValue): QualificationLevelPage {
    this.radio(value).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  radio = (value: QualificationLevelValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
