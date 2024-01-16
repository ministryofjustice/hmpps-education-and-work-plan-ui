import type { Timeline, TimelineEvent } from 'viewModels'
import type { TimelineEventResponse } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { toTimeline } from '../data/mappers/timelineMapper'
import logger from '../../logger'
import PrisonService from './prisonService'
import { HmppsAuthClient } from '../data'

const SUPPORTED_TIMELINE_EVENTS = ['ACTION_PLAN_CREATED', 'INDUCTION_UPDATED', 'GOAL_UPDATED', 'GOAL_CREATED']

export default class TimelineService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getTimeline(prisonNumber: string, token: string, username: string): Promise<Timeline> {
    try {
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
      timelineResponse.events = timelineResponse.events.filter(this.filterTimelineEvents)

      const timeline = toTimeline(timelineResponse)
      timeline.events = await this.addPrisonNameToPrisons(timeline.events, username)
      return timeline
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No Timeline for prisoner [${prisonNumber}]: ${error}`)
        return undefined
      }
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as Timeline
    }
  }

  private addPrisonNameToPrisons = async (
    events: Array<TimelineEvent>,
    username: string,
  ): Promise<Array<TimelineEvent>> => {
    if (!events || events.length === 0) {
      return []
    }

    // Lookup the prison for the first event by itself to prevent a race condition on the `PrisonService`
    // If the `PrisonStore` cache is empty/stale, attempting to lookup all the event's prisons in a `Promise.all`
    // loop results in a race condition where all prison look ups run (essentially) at the same time, and they all try
    // to populate the cache from the `prison-register-api`. This results in many REST API calls to `prison-register-api`
    // effectively spamming `prison-register-api` !
    const firstEvent: TimelineEvent = {
      ...events[0],
      prison: await this.prisonService.lookupPrison(events[0].prison.prisonId, username),
    }

    // Lookup the prisons for the remaining events. We can do this in an async loop, safe in the knowledge that the
    // `PrisonService` is backed by a populated cache and therefore no race condition.
    const otherEvents: Array<Promise<TimelineEvent>> = events.slice(1).map(async (event): Promise<TimelineEvent> => {
      return {
        ...event,
        prison: await this.prisonService.lookupPrison(event.prison.prisonId, username),
      }
    })

    const eventPromises: Array<Promise<TimelineEvent>> = [
      // Wrap the first event in a promise (it was created as a non-promise initially to force it to be created synchronously)
      Promise.resolve().then(() => {
        return firstEvent
      }),
      // The other events are already promises as they were created in an async loop
      ...otherEvents,
    ]
    return Promise.all(eventPromises)
  }

  private filterTimelineEvents = (event: TimelineEventResponse): boolean =>
    SUPPORTED_TIMELINE_EVENTS.includes(event.eventType)
}
