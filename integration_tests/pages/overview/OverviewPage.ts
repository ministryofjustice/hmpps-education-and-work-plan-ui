import Page, { PageElement } from '../page'
import CreateGoalsPage from '../goal/CreateGoalsPage'
import UpdateGoalPage from '../goal/UpdateGoalPage'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'
import HopingToWorkOnReleasePage from '../induction/HopingToWorkOnReleasePage'

/**
 * Cypress page class representing the Overview tab of the Overview Page
 */
export default class OverviewPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Overview')
  }

  isForPrisoner(expected: string): OverviewPage {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  isPreInduction(): OverviewPage {
    this.preInductionOverviewPanel().should('be.visible')
    this.postInductionOverviewPanel().should('not.exist')
    return this
  }

  isPostInduction(): OverviewPage {
    this.preInductionOverviewPanel().should('not.exist')
    this.postInductionOverviewPanel().should('be.visible')
    return this
  }

  hasAddGoalButtonDisplayed(): OverviewPage {
    this.addGoalButton().should('be.visible')
    return this
  }

  doesNotHaveAddGoalButton(): OverviewPage {
    this.addGoalButton().should('not.exist')
    return this
  }

  doesNotHaveUpdateGoalButtons(): OverviewPage {
    this.goalUpdateButton(1).should('not.exist')
    return this
  }

  clickAddGoalButton(): CreateGoalsPage {
    this.addGoalButton().click()
    return Page.verifyOnPage(CreateGoalsPage)
  }

  clickMakeProgressPlan(): HopingToWorkOnReleasePage {
    this.makeProgressPlanLink().click()
    return Page.verifyOnPage(HopingToWorkOnReleasePage)
  }

  activeTabIs(expected: string): OverviewPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  clickToViewAllFunctionalSkills(): FunctionalSkillsPage {
    this.viewAllFunctionalSkillsButton().click()
    return Page.verifyOnPage(FunctionalSkillsPage)
  }

  selectTab(targetTab: string): OverviewPage {
    cy.get(`.moj-sub-navigation__link:contains('${targetTab}')`).click()
    return this
  }

  hasGoalsDisplayed(): OverviewPage {
    this.goalSummaryCards().should('exist')
    return this
  }

  hasNoGoalsDisplayed(): OverviewPage {
    this.goalSummaryCards().should('not.exist')
    return this
  }

  clickUpdateButtonForFirstGoal(): UpdateGoalPage {
    this.goalUpdateButton(1).click()
    return Page.verifyOnPage(UpdateGoalPage)
  }

  hasEmptyGoalsSection(): OverviewPage {
    cy.get('h2').contains('Goals in progress')
    this.goalSummaryCards().should('not.exist')
    return this
  }

  hasGoalNotesExpander(): OverviewPage {
    this.notesExpander(1).should('exist')
    this.notesExpander(1).should('not.have.attr', 'open')
    return this
  }

  hasFunctionalSkillsSidebar(): OverviewPage {
    this.functionalSkillsSidebarTable().should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageInFunctionalSkillsSidebar(): OverviewPage {
    this.functionalSkillsSidebarTable().should('not.exist')
    this.functionalSkillsSidebarErrorHeading().should('be.visible')
    return this
  }

  hasMostRecentQualificationsSidebar(): OverviewPage {
    this.mostRecentQualificationsSidebarTable().should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageInMostRecentQualificationsSidebar(): OverviewPage {
    this.mostRecentQualificationsSidebarTable().should('not.exist')
    this.mostRecentQualificationsSidebarErrorHeading().should('be.visible')
    return this
  }

  hasServiceUnavailableMessageDisplayed(): OverviewPage {
    cy.get('h2').contains('Sorry, the service is currently unavailable.')
    return this
  }

  printThisPageIsPresent(): OverviewPage {
    this.printThisPageLink().should('be.visible')
    return this
  }

  printThisPageIsNotPresent(): OverviewPage {
    this.printThisPageLink().should('not.exist')
    return this
  }

  hasGoalsCreatedSuccessfullyMessage(): OverviewPage {
    this.goalCreationSuccessMessage().should('be.visible')
    return this
  }

  doesNotHaveGoalsCreatedSuccessfullyMessage(): OverviewPage {
    this.goalCreationSuccessMessage().should('not.exist')
    return this
  }

  private prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private addGoalButton = (): PageElement => cy.get('#add-goal-button')

  private functionalSkillsSidebarTable = (): PageElement => cy.get('#functional-skills-sidebar-table')

  private functionalSkillsSidebarErrorHeading = (): PageElement =>
    cy.get('[data-qa=functional-skills-sidebar-error-heading]')

  private mostRecentQualificationsSidebarTable = (): PageElement => cy.get('#qualifications-achievements-sidebar-table')

  private mostRecentQualificationsSidebarErrorHeading = (): PageElement =>
    cy.get('[data-qa=qualifications-achievements-sidebar-error-heading]')

  private goalSummaryCards = (): PageElement => cy.get('[data-qa=goal-summary-card]')

  private goalUpdateButton = (idx: number): PageElement => cy.get(`[data-qa=goal-${idx}-update-button]`)

  private workExperienceSummaryCard = (): PageElement => cy.get('#work-experience-summary-card')

  private viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')

  private notesExpander = (idx: number): PageElement => cy.get(`[data-qa=overview-notes-expander-${idx}]`)

  private preInductionOverviewPanel = (): PageElement => cy.get('[data-qa=pre-induction-overview]')

  private postInductionOverviewPanel = (): PageElement => cy.get('[data-qa=post-induction-overview]')

  private makeProgressPlanLink = (): PageElement =>
    cy.get('[data-qa=pre-induction-overview] a.govuk-notification-banner__link')

  private printThisPageLink = (): PageElement => cy.get('#print-link')

  private goalCreationSuccessMessage = (): PageElement => cy.get('[data-qa=goal-creation-success-message]')
}
