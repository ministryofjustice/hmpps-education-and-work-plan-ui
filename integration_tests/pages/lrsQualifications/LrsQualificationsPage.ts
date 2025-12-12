import Page, { PageElement } from '../page'

export default class LrsQualificationsPage extends Page {
  constructor() {
    super('lrs-qualifications')
  }

  hasVerifiedQualificationsDisplayed(): LrsQualificationsPage {
    this.verifiedQualifications().should('be.visible')
    return this
  }

  hasLearnerNotMatchedMessageDisplayed(): LrsQualificationsPage {
    this.learnerNotMatchedMessage().should('be.visible')
    return this
  }

  hasLearnerRecordsUnavailableMessageDisplayed(): LrsQualificationsPage {
    this.learnerRecordsUnavailableMessage().should('be.visible')
    return this
  }

  private verifiedQualifications = (): PageElement => cy.get('[data-qa=verified-qualifications]')

  private learnerMatchedButHasNoQualificationsMessage = (): PageElement =>
    cy.get('[data-qa=learner-matched-but-has-no-qualifications-message]')

  private learnerNotMatchedMessage = (): PageElement => cy.get('[data-qa=not-matched-in-lrs-message]')

  private learnerDeclinedToShareDataMessage = (): PageElement =>
    cy.get('[data-qa=learner-declined-to-share-data-message]')

  private learnerRecordsUnavailableMessage = (): PageElement => cy.get('[data-qa=learner-records-unavailable-message]')
}
