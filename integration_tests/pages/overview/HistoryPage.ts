import GoalsPage from './GoalsPage'
import Page, { PageElement } from '../page'

/**
 * Cypress page class representing the History tab of the Overview Page (previously known as the Timeline tab)
 */
export default class HistoryPage extends Page {
  constructor() {
    super('overview')
    this.activeTabIs('History')
  }

  activeTabIs(expected: string): HistoryPage {
    this.activeTab().should('contain.text', expected)
    return this
  }

  hasTimelineUnavailableMessageDisplayed(): HistoryPage {
    this.timelineContainer().should('not.exist')
    this.timelineUnavailableMessage().should('be.visible')
    this.emptyTimelineMessage().should('not.exist')
    return this
  }

  hasEmptyTimelineMessageDisplayed(): HistoryPage {
    this.timelineContainer().should('not.exist')
    this.timelineUnavailableMessage().should('not.exist')
    this.emptyTimelineMessage().should('be.visible')
    return this
  }

  hasTimelineDisplayed(): HistoryPage {
    this.timelineContainer().should('be.visible')
    this.timelineUnavailableMessage().should('not.exist')
    this.emptyTimelineMessage().should('not.exist')
    return this
  }

  hasTimelineEventsInOrder = (events: string[]): HistoryPage => {
    cy.get('div.moj-timeline div.moj-timeline__item').each((el, idx) => {
      cy.wrap(el.attr('data-qa-event-type')).should('eq', events[idx])
    })
    return this
  }

  clickViewArchivedGoalsButton(): GoalsPage {
    this.viewArchivedGoalsButton().first().click()
    return Page.verifyOnPage(GoalsPage)
  }

  clickViewGoalsButton(): GoalsPage {
    this.viewGoalsButton().first().click()
    return Page.verifyOnPage(GoalsPage)
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  emptyTimelineMessage = (): PageElement => cy.get('[data-qa=empty-timeline-message]')

  timelineUnavailableMessage = (): PageElement => cy.get('[data-qa=timeline-unavailable-message]')

  timelineContainer = (): PageElement => cy.get('div.moj-timeline')

  viewArchivedGoalsButton = (): PageElement => cy.get('[data-qa=view-archived-goals-button]')

  viewGoalsButton = (): PageElement => cy.get('[data-qa=view-goals-button]')
}
