export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(
    private readonly title: string,
    private readonly options: { axeTest?: boolean } = {
      axeTest: true,
    },
  ) {
    this.checkOnPage()
    this.checkCsfrTokenForFormBasedPages()
    if (options.axeTest) {
      this.runAxe()
    }
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  checkCsfrTokenForFormBasedPages = (): void => {
    cy.get('body').then(body => {
      body.find('form').each((idx, form) => {
        cy.wrap(form).find('input[name=_csrf]').should('not.have.value', '')
      })
    })
  }

  runAxe = (): void => {
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious'],
    })
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')
}
