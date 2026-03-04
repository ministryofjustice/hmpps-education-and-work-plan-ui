import Page, { PageElement } from '../page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../server/enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../../../server/enums/employabilitySkillSessionType'

export default class AddEmployabilitySkillRatingsPage extends Page {
  constructor() {
    super('add-employability-skill-ratings')
  }

  isForSkill = (employabilitySkill: EmployabilitySkillsValue): AddEmployabilitySkillRatingsPage => {
    this.skillHeaderSection(employabilitySkill).should('exist')
    return this
  }

  selectRating = (value: EmployabilitySkillRatingValue): AddEmployabilitySkillRatingsPage => {
    this.ratingRadio(value).click()
    return this
  }

  selectSessionType = (value: EmployabilitySkillSessionType): AddEmployabilitySkillRatingsPage => {
    this.sessionTypeRadio(value).click()
    return this
  }

  enterEvidence = (evidence: string): AddEmployabilitySkillRatingsPage => {
    this.evidenceField().clear().type(evidence, { delay: 0 })
    return this
  }

  enterEducationCourseName = (courseName: string): AddEmployabilitySkillRatingsPage => {
    this.educationCourseNameField().clear().type(courseName, { delay: 0 })
    return this
  }

  enterIndustriesWorkshopName = (workshopName: string): AddEmployabilitySkillRatingsPage => {
    this.industriesWorkshopNameField().clear().type(workshopName, { delay: 0 })
    return this
  }

  private skillHeaderSection = (employabilitySkill: EmployabilitySkillsValue): PageElement =>
    cy.get(`[data-qa=${employabilitySkill}-employability-skill-ratings-header]`)

  private evidenceField = (): PageElement => cy.get('#evidence')

  private ratingRadio = (value: EmployabilitySkillRatingValue): PageElement =>
    cy.get(`.govuk-radios__input[name=rating][value='${value}']`)

  private sessionTypeRadio = (value: EmployabilitySkillSessionType): PageElement =>
    cy.get(`.govuk-radios__input[name=sessionType][value='${value}']`)

  private educationCourseNameField = (): PageElement => cy.get('#educationCourseName')

  private industriesWorkshopNameField = (): PageElement => cy.get('#industriesWorkshopName')
}
