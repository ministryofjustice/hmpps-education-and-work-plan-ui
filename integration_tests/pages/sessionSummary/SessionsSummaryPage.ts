import Page, { PageElement } from '../page'
import PrisonerListPage from '../prisonerList/PrisonerListPage'

export default class SessionsSummaryPage extends Page {
  constructor() {
    super('sessions-summary-page')
  }

  setNameSearchTerm(value: string): SessionsSummaryPage {
    this.searchTermField().clear().type(value)
    return this
  }

  clickLinkToSearchAllPrisonersInPrison(): PrisonerListPage {
    this.linkToPrisonerListPage().click()
    return Page.verifyOnPage(PrisonerListPage)
  }

  hasNumberOfSessionsDue(expected: number): SessionsSummaryPage {
    this.dueSessionsCount().should('contain.text', expected)
    return this
  }

  hasNumberOfSessionsOverdue(expected: number): SessionsSummaryPage {
    this.overdueSessionsCount().should('contain.text', expected)
    return this
  }

  hasNumberOfSessionsOnHold(expected: number): SessionsSummaryPage {
    this.onHoldSessionsCount().should('contain.text', expected)
    return this
  }

  private searchTermField = (): PageElement => cy.get('#searchTerm')

  private linkToPrisonerListPage = (): PageElement => cy.get('[data-qa=link-to-search-page]')

  private overdueSessionsCount = (): PageElement => cy.get('[data-qa=overdue-sessions-count]')

  private dueSessionsCount = (): PageElement => cy.get('[data-qa=due-sessions-count]')

  private onHoldSessionsCount = (): PageElement => cy.get('[data-qa=on-hold-sessions-count]')
}
