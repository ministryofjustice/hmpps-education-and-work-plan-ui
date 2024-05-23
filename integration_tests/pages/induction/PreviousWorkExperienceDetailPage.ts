import { PageElement } from '../page'
import InductionPage from './InductionPage'

export default class PreviousWorkExperienceDetailPage extends InductionPage {
  constructor() {
    super('induction-previous-work-experience-detail')
  }

  setJobRole(value: string): PreviousWorkExperienceDetailPage {
    this.jobRoleField().clear().type(value)
    return this
  }

  hasJobRole(expected: string): PreviousWorkExperienceDetailPage {
    this.jobRoleField().should('have.value', expected)
    return this
  }

  clearJobRole(): PreviousWorkExperienceDetailPage {
    this.jobRoleField().clear()
    return this
  }

  setJobDetails(value: string): PreviousWorkExperienceDetailPage {
    this.jobDetailsField().clear().type(value)
    return this
  }

  hasJobDetails(expected: string): PreviousWorkExperienceDetailPage {
    this.jobDetailsField().should('have.value', expected)
    return this
  }

  clearJobDetails(): PreviousWorkExperienceDetailPage {
    this.jobDetailsField().clear()
    return this
  }

  submitPage() {
    this.submitButton().click()
  }

  jobRoleField = (): PageElement => cy.get('#jobRole')

  jobDetailsField = (): PageElement => cy.get('#jobDetails')

  submitButton = (): PageElement => cy.get('#submit-button')
}
