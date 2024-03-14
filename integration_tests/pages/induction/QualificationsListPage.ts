import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Induction "Qualifications List" page
 */
export default class QualificationsListPage extends Page {
  constructor() {
    super('induction-educational-qualifications-list')
  }

  hasEducationalQualifications(expected: Array<string>): QualificationsListPage {
    this.educationalQualificationsTable()
      .find('[data-qa=educational-qualification-subject]')
      .then(subjectTableCells => {
        const subjects = subjectTableCells.map((idx, el) => el.textContent).get()
        cy.wrap(subjects)
          .should('have.length', expected.length)
          .each(value => {
            expect(expected).to.contain(value)
          })
      })
    return this
  }

  hasCuriousUnavailableMessageDisplayed() {
    this.curiousUnavailableMessage().should('be.exist')
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  submitButton = (): PageElement => cy.get('#submit-button')

  educationalQualificationsTable = (): PageElement => cy.get('[data-qa=educational-qualifications-table]')

  curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')
}
