import Page, { PageElement } from '../page'
import CreateGoalPage from '../goal/CreateGoalPage'

export default class OverviewPage extends Page {
  constructor() {
    super('overview')
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
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasAddGoalButtonDisplayed() {
    this.addGoalButton().should('be.visible')
    return this
  }

  doesNotHaveAddGoalButton() {
    this.addGoalButton().should('not.exist')
    return this
  }

  clickAddGoalButton(): CreateGoalPage {
    this.addGoalButton().click()
    return Page.verifyOnPage(CreateGoalPage)
  }

  activeTabIs(expected: string) {
    this.activeTab().should('contain.text', expected)
    return this
  }

  breadCrumb = (): PageElement => cy.get('.govuk-breadcrumbs')

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  addGoalButton = (): PageElement => cy.get('#add-goal-button')
}
