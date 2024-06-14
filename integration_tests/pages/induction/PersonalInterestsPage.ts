import { PageElement } from '../page'
import PersonalInterestsValue from '../../../server/enums/personalInterestsValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Personal Interests" page
 */
export default class PersonalInterestsPage extends InductionPage {
  constructor() {
    super('induction-personal-interests')
  }

  selectPersonalInterest(option: PersonalInterestsValue): PersonalInterestsPage {
    this.checkbox(option).then(checkbox => {
      if (!checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  deSelectPersonalInterest(option: PersonalInterestsValue): PersonalInterestsPage {
    this.checkbox(option).then(checkbox => {
      if (checkbox.attr('checked')) {
        cy.wrap(checkbox).click()
      }
    })
    return this
  }

  setOtherPersonalInterestType(value: string): PersonalInterestsPage {
    this.otherPersonalInterestField().clear().type(value)
    return this
  }

  clearOtherPersonalInterestType(): PersonalInterestsPage {
    this.otherPersonalInterestField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  checkbox = (option: PersonalInterestsValue): PageElement => cy.get(`.govuk-checkboxes__input[value='${option}']`)

  otherPersonalInterestField = (): PageElement => cy.get('#personalInterestsOther')

  submitButton = (): PageElement => cy.get('#submit-button')
}
