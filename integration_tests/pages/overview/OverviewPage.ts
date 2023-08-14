import Page, { PageElement } from '../page'
import CreateGoalPage from '../goal/CreateGoalPage'
import UpdateGoalPage from '../goal/UpdateGoalPage'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'

export default class OverviewPage extends Page {
  constructor() {
    super('overview')
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

  doesNotHaveUpdateGoalButtons() {
    this.goalUpdateButton(0).should('not.exist')
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

  clickToViewAllFunctionalSkills(): FunctionalSkillsPage {
    this.viewAllFunctionalSkillsButton().click()
    return Page.verifyOnPage(FunctionalSkillsPage)
  }

  selectTab(targetTab: string) {
    cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`).click()
    return this
  }

  hasGoalsDisplayed() {
    this.goalSummaryCards().should('exist')
  }

  clickUpdateButtonForFirstGoal(): UpdateGoalPage {
    this.goalUpdateButton(0).click()
    return Page.verifyOnPage(UpdateGoalPage)
  }

  hasEmptyGoalsSection() {
    cy.get('h2').contains('Goals in progress')
    this.goalSummaryCards().should('not.exist')
    return this
  }

  hasFunctionalSkillsDisplayed() {
    this.functionalSkillsTable().should('be.visible')
    return this
  }

  doesNotHaveFunctionalSkillsDisplayed() {
    this.functionalSkillsTable().should('not.exist')
    return this
  }

  hasCompletedInPrisonQualificationsDisplayed() {
    this.completedInPrisonQualificationsTable().should('be.visible')
    return this
  }

  doesNotCompletedInPrisonQualificationsDisplayed() {
    this.completedInPrisonQualificationsTable().should('not.exist')
    return this
  }

  hasFunctionalSkillsSidebar() {
    this.functionalSkillsSidebarTable().should('be.visible')
    return this
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

  completedInPrisonQualificationsTable = (): PageElement => cy.get('#completed-in-prison-qualifications-table')

  functionalSkillsSidebarTable = (): PageElement => cy.get('#functional-skills-sidebar-table')

  goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  goalUpdateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-update-button]`)

  healthAndSupportNeedsSummaryCard = (): PageElement => cy.get('#health-and-support-needs-summary-card')

  neurodiversitySummaryCard = (): PageElement => cy.get('#neurodiversity-summary-card')

  viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')
}
