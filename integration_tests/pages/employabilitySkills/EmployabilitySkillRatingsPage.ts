import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'

export default class EmployabilitySkillRatingsPage extends Page {
  constructor() {
    super('employability-skill-ratings')
  }

  isForSkill = (employabilitySkill: EmployabilitySkillsValue): EmployabilitySkillRatingsPage => {
    this.skillHeaderSection(employabilitySkill).should('exist')
    return this
  }

  hasSkillRatingsDisplayed = (employabilitySkill: EmployabilitySkillsValue): EmployabilitySkillRatingsPage => {
    this.skillRatingsTable(employabilitySkill).should('be.visible')
    return this
  }

  hasNoSkillRatingsRecorded = (): EmployabilitySkillRatingsPage => {
    this.noEmployabilitySkillRatingsRecordedMessage().should('be.visible')
    return this
  }

  hasEmployabilitySkillsUnavailableMessageDisplayed(): EmployabilitySkillRatingsPage {
    this.employabilitySkillsUnavailableMessage().should('be.visible')
    return this
  }

  private skillHeaderSection = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=${employabilitySkill}-employability-skill-ratings-header]`)

  private skillRatingsTable = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=${employabilitySkill}-employability-skill-ratings-table]`)

  private noEmployabilitySkillRatingsRecordedMessage = (): PageElement =>
    cy.get('[data-qa=no-employability-skill-ratings-recorded]')

  private addRatingLink = (): PageElement => cy.get('[data-qa=add-rating-link]')

  private employabilitySkillsUnavailableMessage = (): PageElement =>
    cy.get('[data-qa=employability-skills-unavailable-message]')
}
