import Page, { PageElement } from '../page'
// eslint-disable-next-line import/no-cycle
import OverviewPage from '../overview/OverviewPage'

export default class FunctionalSkillsPage extends Page {
  constructor() {
    super('functional-skills')
  }

  isForPrisoner(expected: string) {
    this.prisonNumberLabel().should('have.text', expected)
    return this
  }

  englishAndMathsAreDisplayedInLatestFunctionalSkillsTable() {
    const latestFunctionalSkillsTable = this.latestFunctionalSkillsTable()
    latestFunctionalSkillsTable.should('exist')
    const functionalSkillsRows = latestFunctionalSkillsTable.find('.govuk-table__body .govuk-table__row')
    functionalSkillsRows.should('have.length.at.least', 2)

    functionalSkillsRows
      // English should always be the first row.
      .then(rows => {
        cy.wrap(rows.eq(0)).should('contain.text', 'English skills')
        cy.wrap(rows)
      })
      // Maths should always be the 2nd row.
      .then(rows => {
        cy.wrap(rows.eq(1)).should('contain.text', 'Maths skills')
        cy.wrap(rows)
      })

    return this
  }

  englishAndMathsAreDisplayedInAssessmentHistoryTable() {
    const assessmentHistoryTable = this.assessmentHistoryTable()
    assessmentHistoryTable.should('exist')
    const assessmentHistoryRows = assessmentHistoryTable.find('.govuk-table__body .govuk-table__row')

    assessmentHistoryRows //
      // Assessment History must always contain at least 1 of both English and Maths, but the order is based on assessment date.
      // It is sufficient to assert they exist in the table, rather than exist in a specific order/position.
      .should('contain.text', 'English skills')
      .should('contain.text', 'Maths skills')

    return this
  }

  clickLearningPlanBreadcrumb(): OverviewPage {
    this.breadCrumb().find('a').last().click() // The Prisoner's Learning Plan is the last breadcrumb on the Functional Skills page
    return Page.verifyOnPage(OverviewPage)
  }

  doesNotHaveFunctionalSkillsDisplayed() {
    this.latestFunctionalSkillsTable().should('not.exist')
    return this
  }

  doesNotHaveAssessmentHistoryDisplayed() {
    this.assessmentHistoryTable().should('not.exist')
    return this
  }

  hasCuriousUnavailableMessageDisplayed() {
    this.curiousUnavailableMessage().should('be.exist')
    return this
  }

  prisonNumberLabel = (): PageElement => cy.get('[data-qa=prison-number]')

  latestFunctionalSkillsTable = (): PageElement => cy.get('#latest-functional-skills-table')

  assessmentHistoryTable = (): PageElement => cy.get('#functional-skills-assessments-history-table')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')
}
