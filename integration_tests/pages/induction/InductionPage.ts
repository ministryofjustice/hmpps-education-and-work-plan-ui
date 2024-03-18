import Page, { PageElement } from '../page'

export default abstract class InductionPage extends Page {
  constructor(pageId: string, options?: { axeTest?: boolean }) {
    super(pageId, options)
  }

  clickBackLinkTo = <T extends Page>(expected: new () => T): T => {
    this.backLink().click()
    return Page.verifyOnPage(expected)
  }

  hasBackLinkTo = (expected: string) => {
    this.backLink().should('have.attr', 'href', expected)
    return this
  }

  backLinkHasAriaLabel = (expected: string) => {
    this.backLink().should('have.attr', 'aria-label', expected)
    return this
  }

  private backLink(): PageElement {
    return cy.get('.govuk-back-link')
  }
}
