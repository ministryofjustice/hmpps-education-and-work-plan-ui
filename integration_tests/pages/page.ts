export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(
    readonly pageId: string,
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
    cy.get('#pageId').should('have.attr', 'data-qa').should('equal', this.pageId)
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

  hasNoErrors() {
    cy.get('.govuk-error-summary__list').should('not.exist')
    return this
  }

  hasErrorCount(expected: number) {
    cy.get('.govuk-error-summary__list').should('have.length', expected)
    return this
  }

  hasFieldInError(field: string) {
    cy.get(`#${field}-error`).should('exist')
    return this
  }

  hasMainHeading(expectedHeading: string) {
    cy.get('h1').should('contain.text', expectedHeading)
    return this
  }

  hasBreadcrumb() {
    this.breadCrumb().find('a').first().should('have.text', 'Digital Prison Services')
    return this
  }

  breadcrumbDoesNotIncludeCurrentPage() {
    cy.get('h1')
      .invoke('text')
      .then(pageTitle => {
        this.breadCrumb()
          .find('a')
          .last()
          .invoke('text')
          .should(breadcrumbText => {
            expect(pageTitle).not.to.eq(breadcrumbText)
          })
      })
    return this
  }

  hasFooter() {
    cy.get('.connect-dps-common-footer').should('exist')
    return this
  }

  hasFallbackFooter() {
    cy.get('.govuk-footer').should('exist')
    return this
  }

  breadCrumb = (): PageElement => cy.get('.govuk-breadcrumbs')
}
