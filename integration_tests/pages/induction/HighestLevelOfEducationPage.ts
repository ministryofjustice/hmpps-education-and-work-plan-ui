import Page, { PageElement } from '../page'
import EducationLevelValue from '../../../server/enums/educationLevelValue'

/**
 * Cypress page class representing the Induction "Highest Level of Education" page
 */
export default class HighestLevelOfEducationPage extends Page {
  constructor() {
    super('induction-highest-level-of-education')
  }

  selectHighestLevelOfEducation(value: EducationLevelValue): HighestLevelOfEducationPage {
    this.radio(value).click()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  radio = (value: EducationLevelValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
