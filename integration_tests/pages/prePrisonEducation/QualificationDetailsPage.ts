import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the "Qualification Details" page
 */
export default class QualificationDetailsPage extends Page {
  constructor() {
    super('qualification-details')
  }

  setQualificationSubject(value: string): QualificationDetailsPage {
    this.qualificationSubjectField().clear().type(value, { delay: 0 })
    return this
  }

  clearQualificationSubject(): QualificationDetailsPage {
    this.qualificationSubjectField().clear()
    return this
  }

  setQualificationGrade(value: string): QualificationDetailsPage {
    this.qualificationGradeField().clear().type(value, { delay: 0 })
    return this
  }

  clearQualificationGrade(): QualificationDetailsPage {
    this.qualificationGradeField().clear()
    return this
  }

  qualificationSubjectField = (): PageElement => cy.get('#qualificationSubject')

  qualificationGradeField = (): PageElement => cy.get('#qualificationGrade')
}
