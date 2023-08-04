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

  selectTab(targetTab: string) {
    cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`).click()
    return this
  }

  hasGoalsDisplayed() {
    this.goalSummaryCards().should('exist')
  }

  hasEmptyGoalsSection() {
    cy.get('h2').contains('Goals in progress')
    this.goalSummaryCards().should('not.exist')
  }

  hasFunctionalSkillsDisplayed() {
    this.functionalSkillsTable().should('be.visible')
  }

  hasFunctionalSkillsSidebar() {
    this.functionalSkillsSidebarTable().should('be.visible')
  }

  hasHealthAndSupportNeedsDisplayed() {
    this.healthAndSupportNeedsSummaryCard().should('be.visible')
    return this
  }

  hasNeurodiversityDisplayed() {
    this.neurodiversitySummaryCard().should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageDisplayed() {
    cy.get('h2').contains('Sorry, the Curious service is currently unavailable')
    return this
  }

  hasServiceUnavailableMessageDisplayed() {
    cy.get('h2').contains('Sorry, the service is currently unavailable.')
    return this
  }

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  addGoalButton = (): PageElement => cy.get('#add-goal-button')

  functionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  functionalSkillsSidebarTable = (): PageElement => cy.get('#functional-skills-sidebar-table')

  goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  healthAndSupportNeedsSummaryCard = (): PageElement => cy.get('#health-and-support-needs-summary-card')

  neurodiversitySummaryCard = (): PageElement => cy.get('#neurodiversity-summary-card')
}
