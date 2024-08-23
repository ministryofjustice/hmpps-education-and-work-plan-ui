import { PageElement } from '../page'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Affect Ability To Work" page
 */
export default class AffectAbilityToWorkPage extends InductionPage {
  constructor() {
    super('induction-affect-ability-to-work')
  }

  selectAffectAbilityToWork(option: AbilityToWorkValue): AffectAbilityToWorkPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectAffectAbilityToWork(option: AbilityToWorkValue): AffectAbilityToWorkPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setAffectAbilityToWorkOther(value: string): AffectAbilityToWorkPage {
    this.affectAbilityToWorkOtherField().clear().type(value)
    return this
  }

  clearAffectAbilityToWorkOther(): AffectAbilityToWorkPage {
    this.affectAbilityToWorkOtherField().clear()
    return this
  }

  checkbox = (option: AbilityToWorkValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  affectAbilityToWorkOtherField = (): PageElement => cy.get('#affectAbilityToWorkOther')
}
