import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import EducationAndTrainingPage from '../overview/EducationAndTrainingPage'

export default class FunctionalSkillsPage extends Page {
  constructor() {
    super('functional-skills')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  hasMathsFunctionalSkillsDisplayed() {
    this.mathsFunctionalSkillsTable().should('be.exist')
    return this
  }

  hasDigitalFunctionalSkillsDisplayed() {
    this.digitalFunctionalSkillsTable().should('be.exist')
    return this
  }

  doesNotHaveEnglishFunctionalSkillsDisplayed() {
    this.englishFunctionalSkillsTable().should('not.exist')
    return this
  }

  doesNotHaveMathsFunctionalSkillsDisplayed() {
    this.mathsFunctionalSkillsTable().should('not.exist')
    return this
  }

  doesNotHaveDigitalFunctionalSkillsDisplayed() {
    this.digitalFunctionalSkillsTable().should('not.exist')
    return this
  }

  clickLearningPlanBreadcrumb(): EducationAndTrainingPage {
    this.breadCrumb().find('a').last().click() // The Prisoner's Learning Plan is the last breadcrumb on the Functional Skills page
    return Page.verifyOnPage(EducationAndTrainingPage)
  }

  hasCuriousUnavailableMessageDisplayed() {
    this.curiousUnavailableMessage().should('be.visible')
    return this
  }

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  englishFunctionalSkillsTable = (): PageElement => cy.get('[data-qa=english-skills-sortable-table]')

  mathsFunctionalSkillsTable = (): PageElement => cy.get('[data-qa=maths-skills-sortable-table]')

  digitalFunctionalSkillsTable = (): PageElement => cy.get('[data-qa=digital-skills-sortable-table]')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')
}
