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

  private searchTermField = (): PageElement => cy.get('#searchTerm')

  private linkToPrisonerListPage = (): PageElement => cy.get('[data-qa=link-to-search-page]')
}
