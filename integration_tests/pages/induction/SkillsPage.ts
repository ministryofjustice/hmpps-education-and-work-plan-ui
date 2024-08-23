import { PageElement } from '../page'
import SkillsValue from '../../../server/enums/skillsValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Skills" page
 */
export default class SkillsPage extends InductionPage {
  constructor() {
    super('induction-skills')
  }

  selectSkill(option: SkillsValue): SkillsPage {
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

  checkbox = (option: SkillsValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  otherSkillField = (): PageElement => cy.get('#skillsOther')
}
