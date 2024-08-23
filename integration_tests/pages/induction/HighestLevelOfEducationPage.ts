import { PageElement } from '../page'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Highest Level of Education" page
 */
export default class HighestLevelOfEducationPage extends InductionPage {
  constructor() {
    super('induction-highest-level-of-education')
  }

  selectHighestLevelOfEducation(value: EducationLevelValue): HighestLevelOfEducationPage {
    this.radio(value).click()
    return this
  }

  radio = (value: EducationLevelValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)
}
