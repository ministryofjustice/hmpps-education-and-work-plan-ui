import { PageElement } from '../page'
import InductionPage from './InductionPage'

/**
 * Cypress page class representing the Induction "Qualifications List" page
 */
export default class QualificationsListPage extends InductionPage {
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

  hasNoEducationalQualificationsDisplayed(): QualificationsListPage {
    this.educationalQualificationsTable().should('not.exist')
    return this
  }

  /**
   * Removes the qualification from the qualifications table by clicking its "Remove" button.
   * The parameter is deliberately one indexed in order to make the tests more readable and intuitive.
   */
  removeQualification(oneBasedIndex: number): QualificationsListPage {
    const zeroBasedIndexToRemove = Math.max(oneBasedIndex, 1) - 1 // Just in case someone calls this method with a zero based index
    this.educationalQualificationsTable()
      .find(`button[name=removeQualification][value=${zeroBasedIndexToRemove}]`)
      .click()
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
