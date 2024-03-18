import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Induction "Qualification Details" page
 */
export default class QualificationDetailsPage extends Page {
  constructor() {
    super('induction-qualification-details')
  }

  setQualificationSubject(value: string): QualificationDetailsPage {
    this.qualificationSubjectField().clear().type(value)
    return this
  }

  clearQualificationSubject(): QualificationDetailsPage {
    this.qualificationSubjectField().clear()
    return this
  }

  setQualificationGrade(value: string): QualificationDetailsPage {
    this.qualificationGradeField().clear().type(value)
    return this
  }

  clearQualificationGrade(): QualificationDetailsPage {
    this.qualificationGradeField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  qualificationSubjectField = (): PageElement => cy.get('#qualificationSubject')

  qualificationGradeField = (): PageElement => cy.get('#qualificationGrade')

  submitButton = (): PageElement => cy.get('#submit-button')
}
