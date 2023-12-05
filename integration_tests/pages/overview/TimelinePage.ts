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

  hasLearningAndWorkProgressPlanEventWithOneGoalDisplayed(): TimelinePage {
    // The timeline is rendered in reverse chronological order, so the last event on the timeline (ie. the last element in the dom)
    // is the first event in time.
    // We expect the last event in the DOM to be the first event in time, which should be ACTION_PLAN_CREATED
    this.lastTimelineEvent().should('have.attr', 'data-qa-event-type', 'ACTION_PLAN_CREATED')
    // We expect the 2nd to last event in the DOM to be the 2nd event in time, which should be GOAL_CREATED ('goal' singular)
    this.lastButOneTimelineEvent().should('have.attr', 'data-qa-event-type', 'GOAL_CREATED')
    return this
  }

  hasLearningAndWorkProgressPlanEventWithMultipleGoalsDisplayed(): TimelinePage {
    // The timeline is rendered in reverse chronological order, so the last event on the timeline (ie. the last element in the dom)
    // is the first event in time.
    // We expect the last event in the DOM to be the first event in time, which should be ACTION_PLAN_CREATED
    this.lastTimelineEvent().should('have.attr', 'data-qa-event-type', 'ACTION_PLAN_CREATED')
    // We expect the 2nd to last event in the DOM to be the 2nd event in time, which should be MULTIPLE_GOALS_CREATED
    this.lastButOneTimelineEvent().should('have.attr', 'data-qa-event-type', 'MULTIPLE_GOALS_CREATED')
    return this
  }

  activeTab = (): PageElement => cy.get('.moj-sub-navigation__link[aria-current=page]')

  emptyTimelineMessage = (): PageElement => cy.get('[data-qa=empty-timeline-message]')

  timelineUnavailableMessage = (): PageElement => cy.get('[data-qa=timeline-unavailable-message]')

  timelineContainer = (): PageElement => cy.get('div.moj-timeline')

  lastTimelineEvent = (): PageElement => cy.get('div.moj-timeline div.moj-timeline__item:last-of-type')

  lastButOneTimelineEvent = (): PageElement => cy.get('div.moj-timeline div.moj-timeline__item:nth-last-child(2)')
}
