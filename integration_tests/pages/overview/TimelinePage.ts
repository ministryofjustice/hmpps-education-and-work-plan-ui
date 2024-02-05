import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the Timeline tab of the Overview Page
 */
export default class TimelinePage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('Timeline')
  }

  activeTabIs(expected: string): TimelinePage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasTimelineUnavailableMessageDisplayed(): TimelinePage {
    this.timelineContainer().should('not.exist')
    this.timelineUnavailableMessage().should('be.visible')
    this.emptyTimelineMessage().should('not.exist')
    return this
  }

  hasEmptyTimelineMessageDisplayed(): TimelinePage {
    this.timelineContainer().should('not.exist')
    this.timelineUnavailableMessage().should('not.exist')
    this.emptyTimelineMessage().should('be.visible')
    return this
  }

  hasTimelineDisplayed(): TimelinePage {
    this.timelineContainer().should('be.visible')
    this.timelineUnavailableMessage().should('not.exist')
    this.emptyTimelineMessage().should('not.exist')
    return this
  }

  hasTimelineEventsInOrder = (events: string[]) => {
    cy.get('div.moj-timeline div.moj-timeline__item').each((el, idx) => {
      cy.wrap(el.attr('data-qa-event-type')).should('eq', events[idx])
    })
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  emptyTimelineMessage = (): PageElement => cy.get('[data-qa=empty-timeline-message]')

  timelineUnavailableMessage = (): PageElement => cy.get('[data-qa=timeline-unavailable-message]')

  timelineContainer = (): PageElement => cy.get('div.moj-timeline')
}
