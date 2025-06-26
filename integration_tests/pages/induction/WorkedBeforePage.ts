import Page, { PageElement } from '../page'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

/**
 * Cypress page class representing the "Has Worked Before" Page.
 */
export default class WorkedBeforePage extends Page {
  constructor() {
    super('induction-has-worked-before')
  }

  selectWorkedBefore(value: HasWorkedBeforeValue): WorkedBeforePage {
    this.radio(value).click()
    return this
  }

  setNotRelevantReason(value: string): WorkedBeforePage {
    this.notRelevantReasonField().clear().type(value, { delay: 0 })
    return this
  }

  clearNotRelevantReason(): WorkedBeforePage {
    this.notRelevantReasonField().clear()
    return this
  }

  private radio = (value: HasWorkedBeforeValue): PageElement => cy.get(`.govuk-radios__input[value='${value}']`)

  private notRelevantReasonField = (): PageElement => cy.get('#hasWorkedBeforeNotRelevantReason')
}
