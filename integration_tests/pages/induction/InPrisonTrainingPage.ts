import Page, { PageElement } from '../page'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'

/**
 * Cypress page class representing the Induction "In Prison Training" page
 */
export default class InPrisonTrainingPage extends Page {
  constructor() {
    super('induction-in-prison-training')
  }

  selectInPrisonTraining(option: InPrisonTrainingValue): InPrisonTrainingPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectInPrisonTraining(option: InPrisonTrainingValue): InPrisonTrainingPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setInPrisonTrainingOther(value: string): InPrisonTrainingPage {
    this.inPrisonTrainingOtherField().clear().type(value, { delay: 0 })
    return this
  }

  clearInPrisonTrainingOther(): InPrisonTrainingPage {
    this.inPrisonTrainingOtherField().clear()
    return this
  }

  checkbox = (option: InPrisonTrainingValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  inPrisonTrainingOtherField = (): PageElement => cy.get('#inPrisonTrainingOther')
}
