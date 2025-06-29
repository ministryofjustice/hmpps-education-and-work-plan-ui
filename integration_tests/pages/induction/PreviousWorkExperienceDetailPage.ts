import Page, { PageElement } from '../page'

export default class PreviousWorkExperienceDetailPage extends Page {
  constructor() {
    super('induction-previous-work-experience-detail')
  }

  setJobRole(value: string): PreviousWorkExperienceDetailPage {
    this.jobRoleField().clear().type(value, { delay: 0 })
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
    this.jobDetailsField().clear().type(value, { delay: 0 })
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

  jobRoleField = (): PageElement => cy.get('#jobRole')

  jobDetailsField = (): PageElement => cy.get('#jobDetails')
}
