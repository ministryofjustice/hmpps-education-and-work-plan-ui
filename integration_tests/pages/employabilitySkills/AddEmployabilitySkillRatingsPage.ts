import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../server/enums/employabilitySkillRatingValue'

export default class AddEmployabilitySkillRatingsPage extends Page {
  constructor() {
    super('add-employability-skill-ratings')
  }

  isForSkill = (employabilitySkill: EmployabilitySkillsValue): AddEmployabilitySkillRatingsPage => {
    this.skillHeaderSection(employabilitySkill).should('exist')
    return this
  }

  selectRating = (value: EmployabilitySkillRatingValue): AddEmployabilitySkillRatingsPage => {
    this.radio(value).click()
    return this
  }

  enterEvidence = (evidence: string): AddEmployabilitySkillRatingsPage => {
    this.evidenceField().clear().type(evidence, { delay: 0 })
    return this
  }

  private skillHeaderSection = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=${employabilitySkill}-employability-skill-ratings-header]`)

  private evidenceField = (): PageElement => cy.get('#evidence')

  private radio = (value: EmployabilitySkillRatingValue): PageElement =>
    cy.get(`.govuk-radios__input[value='${value}']`)
}
