import { PageElement } from '../page'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Future Work Interest Roles" page
 */
export default class FutureWorkInterestRolesPage extends InductionPage {
  constructor() {
    super('induction-future-work-interest-roles')
  }

  setWorkInterestRole(workInterestType: WorkInterestTypeValue, value: string): FutureWorkInterestRolesPage {
    this.workInterestRoleField(workInterestType).clear().type(value)
    return this
  }

  clearWorkInterestRole(workInterestType: WorkInterestTypeValue): FutureWorkInterestRolesPage {
    this.workInterestRoleField(workInterestType).clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  workInterestRoleField = (workInterestType: WorkInterestTypeValue): PageElement => cy.get(`#${workInterestType}`)

  submitButton = (): PageElement => cy.get('#submit-button')
}
