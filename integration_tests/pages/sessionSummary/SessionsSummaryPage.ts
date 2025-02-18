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

  clickToGoToDueSessionsPage = () => this.dueSessionsButton().click()

  hasNumberOfSessionsOverdue(expected: number): SessionsSummaryPage {
    this.overdueSessionsCount().should('contain.text', expected)
    return this
  }

  clickToGoToOverdueSessionsPage = () => this.overdueSessionsButton().click()

  hasNumberOfSessionsOnHold(expected: number): SessionsSummaryPage {
    this.onHoldSessionsCount().should('contain.text', expected)
    return this
  }

  clickToGoToOnHoldSessionsPage = () => this.onHoldSessionsButton().click()

  private searchTermField = (): PageElement => cy.get('#searchTerm')

  private linkToPrisonerListPage = (): PageElement => cy.get('[data-qa=link-to-search-page]')

  private overdueSessionsCount = (): PageElement => cy.get('[data-qa=overdue-sessions-count]')

  private overdueSessionsButton = (): PageElement => cy.get('[data-qa=view-overdue-sessions-button]')

  private dueSessionsCount = (): PageElement => cy.get('[data-qa=due-sessions-count]')

  private dueSessionsButton = (): PageElement => cy.get('[data-qa=view-due-sessions-button]')

  private onHoldSessionsCount = (): PageElement => cy.get('[data-qa=on-hold-sessions-count]')

  private onHoldSessionsButton = (): PageElement => cy.get('[data-qa=view-on-hold-sessions-button]')
}
