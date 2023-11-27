import type { Prison, Timeline, TimelineEvent } from 'viewModels'
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
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
      timelineResponse.events = timelineResponse.events.filter(this.filterTimelineEvents)

      // Check for GOAL_CREATED events with the same correlationId, then change the event type to MULTIPLE_GOALS_CREATED
      // as they've been created at the same time (i.e. within same atomic action)
      const goalCreatedEvents = timelineResponse.events.filter(this.filterGoalCreatedEvents)
      const goalCreatedCorrelationIds = goalCreatedEvents.map((event: TimelineEvent) => event.correlationId)
      const multipleGoalCreatedEvents = goalCreatedCorrelationIds.filter(
        (correlationId: string, index: string) => goalCreatedCorrelationIds.indexOf(correlationId) !== index,
      )

      multipleGoalCreatedEvents.forEach((correlationId: string) => {
        timelineResponse.events = timelineResponse.events.map((event: TimelineEvent) => {
          if (event.correlationId === correlationId) {
            return { ...event, eventType: 'MULTIPLE_GOALS_CREATED' }
          }
          return event
        })
      })

      // Only return a single MULTIPLE_GOALS_CREATED event which has the same correlationId
      timelineResponse.events = timelineResponse.events.filter(
        (event: TimelineEvent, index: number, self: TimelineEvent[]) => {
          const isMultipleGoalsCreated = event.eventType === 'MULTIPLE_GOALS_CREATED'
          const isSameCorrelationIdAsNext = self[index + 1]?.correlationId === event.correlationId

          return !(isMultipleGoalsCreated && isSameCorrelationIdAsNext)
        },
      )

      const timeline = toTimeline(timelineResponse)
      timeline.events = await this.addPrisonNameToPrisons(timeline.events, systemToken)
      return timeline
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as Timeline
    }
  }

  private addPrisonNameToPrisons = async (
    events: Array<TimelineEvent>,
    token: string,
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
      prison: await this.lookupPrison(events[0].prison.prisonId, token),
    }

    // Lookup the prisons for the remaining events. We can do this in an async loop, safe in the knowledge that the
    // `PrisonService` is backed by a populated cache and therefore no race condition.
    const otherEvents: Array<Promise<TimelineEvent>> = events.slice(1).map(async (event): Promise<TimelineEvent> => {
      return {
        ...event,
        prison: await this.lookupPrison(event.prison.prisonId, token),
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

  private async lookupPrison(prisonId: string, token: string): Promise<Prison> {
    try {
      return (await this.prisonService.getPrisonByPrisonId(prisonId, token)) || { prisonId, prisonName: undefined }
    } catch (e) {
      logger.error(`Error looking up prison ${prisonId}`, e)
      // return a Prison with just the prison ID set. Failing to lookup the prison should not stop the Timeline service returning a Timeline
      return { prisonId, prisonName: undefined }
    }
  }

  private filterTimelineEvents = (event: TimelineEventResponse): boolean =>
    SUPPORTED_TIMELINE_EVENTS.includes(event.eventType)

  private filterGoalCreatedEvents = (event: TimelineEventResponse): boolean => event.eventType === 'GOAL_CREATED'
}
