import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../server/enums/employabilitySkillRatingValue'

/**
 * Cypress page class representing the Induction "Employability Skills" page
 */
export default class EmployabilitySkillsPage extends Page {
  constructor() {
    super('induction-employability-skills')
  }

  selectSkill(option: EmployabilitySkillsValue): EmployabilitySkillsPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectSkill(option: EmployabilitySkillsValue): EmployabilitySkillsPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  selectSkillRating(type: EmployabilitySkillsValue, option: EmployabilitySkillRatingValue): EmployabilitySkillsPage {
    this.radio(type, option).click()
    return this
  }

  private checkbox = (option: EmployabilitySkillsValue): PageElement =>
    cy.get(`.govuk-checkboxes__input[value='${option}']`)

  private radio = (type: EmployabilitySkillsValue, option: EmployabilitySkillRatingValue): PageElement =>
    cy.get(`.govuk-radios__input[name='rating[${type}]'][value='${option}']`)
}
