import { format } from 'date-fns'
import Page, { PageElement } from '../page'

export default class ExemptionRecordedPage extends Page {
  constructor() {
    super('induction-exemption-recorded')
  }

  reviewIsOnHold = (): ExemptionRecordedPage => {
    this.sessionOnHoldMessage().should('be.visible')
    this.warningTextMessage().should('be.visible')
    this.reviewDueMessage().should('not.exist')
    return this
  }

  reviewHasNewDeadlineDateOf = (expected: Date): ExemptionRecordedPage => {
    this.sessionOnHoldMessage().should('not.exist')
    this.warningTextMessage().should('not.exist')
    this.reviewDueMessage().should('contain.text', format(expected, 'd MMMM yyyy'))
    return this
  }

  private reviewDueMessage = (): PageElement => cy.get('[data-qa=induction-due]')

  private sessionOnHoldMessage = (): PageElement => cy.get('[data-qa=session-on-hold]')

  private warningTextMessage = (): PageElement => cy.get('[data-qa=warning-text]')
}
