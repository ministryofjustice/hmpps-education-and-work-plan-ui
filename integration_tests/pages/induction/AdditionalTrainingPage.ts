import Page, { PageElement } from '../page'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'

/**
 * Cypress page class representing the Induction "Additional Training" page
 */
export default class AdditionalTrainingPage extends Page {
  constructor() {
    super('induction-additional-training')
  }

  selectAdditionalTraining(option: AdditionalTrainingValue): AdditionalTrainingPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectAdditionalTraining(option: AdditionalTrainingValue): AdditionalTrainingPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setAdditionalTrainingOther(value: string): AdditionalTrainingPage {
    this.additionalTrainingOtherField().clear().type(value)
    return this
  }

  clearAdditionalTrainingOther(): AdditionalTrainingPage {
    this.additionalTrainingOtherField().clear()
    return this
  }

  checkbox = (option: AdditionalTrainingValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  additionalTrainingOtherField = (): PageElement => cy.get('#additionalTrainingOther')
}
