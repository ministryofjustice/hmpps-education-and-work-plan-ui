import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'

export default class EmployabilitySkillRatingsPage extends Page {
  constructor() {
    super('employability-skill-ratings')
  }

  isForSkill = (employabilitySkill: EmployabilitySkillsValue): EmployabilitySkillRatingsPage => {
    this.skillContainer(employabilitySkill).should('exist')
    return this
  }

  hasNoSkillRatingsRecorded = (): EmployabilitySkillRatingsPage => {
    this.noEmployabilitySkillRatingsRecordedMessage().should('be.visible')
    return this
  }

  private skillContainer = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=${employabilitySkill}-employability-skill-ratings]`)

  private noEmployabilitySkillRatingsRecordedMessage = (): PageElement =>
    cy.get('[data-qa=no=employability-skill-ratings-recorded]')

  private addRatingLink = (): PageElement => cy.get('[data-qa=add-rating-link]')
}
