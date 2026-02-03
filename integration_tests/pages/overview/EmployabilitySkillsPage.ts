import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import EmployabilitySkillRatingsPage from '../employabilitySkills/EmployabilitySkillRatingsPage'

/**
 * Cypress page class representing the Employability Skills tab of the Overview Page
 */
export default class EmployabilitySkillsPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Employability skills')
  }

  activeTabIs(expected: string): EmployabilitySkillsPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  clickToViewSkillRatings = (employabilitySkill: EmployabilitySkillsValue): EmployabilitySkillRatingsPage => {
    this.viewRatingsLink(employabilitySkill).click()
    return Page.verifyOnPage(EmployabilitySkillRatingsPage).isForSkill(employabilitySkill)
  }

  private activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  private viewRatingsLink = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=view-${employabilitySkill}-ratings-link]`)

  private addRatingsLink = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=add-${employabilitySkill}-ratings-link]`)
}
