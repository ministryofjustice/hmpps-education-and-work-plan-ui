import Page, { PageElement } from '../page'
import SkillsValue from '../../../server/enums/skillsValue'

/**
 * Cypress page class representing the Induction "Skills" page
 */
export default class SkillsPage extends Page {
  constructor() {
    super('induction-skills')
  }

  chooseSkill(option: SkillsValue): SkillsPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectSkill(option: SkillsValue): SkillsPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setOtherSkillType(value: string): SkillsPage {
    this.otherSkillField().clear().type(value)
    return this
  }

  clearOtherSkillType(): SkillsPage {
    this.otherSkillField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  checkbox = (option: SkillsValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  otherSkillField = (): PageElement => cy.get('#skillsOther')

  submitButton = (): PageElement => cy.get('#submit-button')
}
