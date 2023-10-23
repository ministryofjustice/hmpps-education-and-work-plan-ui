import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import FunctionalSkillsPage from '../functionalSkills/FunctionalSkillsPage'

/**
 * Cypress page class representing the Education And Training tab of the Overview Page
 */
export default class EducationAndTrainingPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Education and training')
  }

  activeTabIs(expected: string): EducationAndTrainingPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasFunctionalSkillsDisplayed(): EducationAndTrainingPage {
    this.functionalSkillsTable().should('be.visible')
    return this
  }

  doesNotHaveFunctionalSkillsDisplayed(): EducationAndTrainingPage {
    this.functionalSkillsTable().should('not.exist')
    return this
  }

  hasCompletedInPrisonQualificationsDisplayed(): EducationAndTrainingPage {
    this.completedInPrisonQualificationsTable().should('be.visible')
    return this
  }

  doesNotCompletedInPrisonQualificationsDisplayed(): EducationAndTrainingPage {
    this.completedInPrisonQualificationsTable().should('not.exist')
    return this
  }

  hasCuriousUnavailableMessageDisplayed(): EducationAndTrainingPage {
    this.curiousUnavailableMessage().should('be.exist')
    return this
  }

  clickToViewAllFunctionalSkills(): FunctionalSkillsPage {
    this.viewAllFunctionalSkillsButton().click()
    return Page.verifyOnPage(FunctionalSkillsPage)
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  functionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  completedInPrisonQualificationsTable = (): PageElement => cy.get('#completed-in-prison-qualifications-table')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')

  viewAllFunctionalSkillsButton = (): PageElement => cy.get('[data-qa=view-all-functional-skills-button]')
}
