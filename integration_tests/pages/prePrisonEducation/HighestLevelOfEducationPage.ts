import Page, { PageElement } from '../page'
import EducationLevelValue from '../../../server/enums/educationLevelValue'

/**
 * Cypress page class representing the "Highest Level of Education" page
 */
export default class HighestLevelOfEducationPage extends Page {
  constructor() {
    super('highest-level-of-education')
  }

  selectHighestLevelOfEducation(value: EducationLevelValue): HighestLevelOfEducationPage {
    this.radio(value).click()
    return this
  }

  hasHighestLevelOfEducation(expected: EducationLevelValue): HighestLevelOfEducationPage {
    this.radio(expected).should('be.checked')
    return this
  }

  radio = (value: EducationLevelValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
