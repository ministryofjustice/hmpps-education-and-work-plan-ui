import Page, { PageElement } from '../page'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'

/**
 * Cypress page class representing the Induction "Future Work Interest Roles" page
 */
export default class FutureWorkInterestRolesPage extends Page {
  constructor() {
    super('induction-future-work-interest-roles')
  }

  setWorkInterestRole(workInterestType: WorkInterestTypeValue, value: string): FutureWorkInterestRolesPage {
    this.workInterestRoleField(workInterestType).clear().type(value, { delay: 0 })
    return this
  }

  clearWorkInterestRole(workInterestType: WorkInterestTypeValue): FutureWorkInterestRolesPage {
    this.workInterestRoleField(workInterestType).clear()
    return this
  }

  workInterestRoleField = (workInterestType: WorkInterestTypeValue): PageElement => cy.get(`#${workInterestType}`)
}
