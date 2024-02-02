import moment from 'moment'
import type { Prison, TimelineEvent } from 'viewModels'

const aTimelineEvent = (options?: CoreBuilderOptions): TimelineEvent => {
  return {
    ...baseTimelineEventTemplate(options),
  }
}

type CoreBuilderOptions = {
  reference?: string
  sourceReference?: string
  eventType?:
    | 'ACTION_PLAN_CREATED'
    | 'GOAL_CREATED'
    | 'MULTIPLE_GOALS_CREATED'
    | 'GOAL_UPDATED'
    | 'INDUCTION_UPDATED'
    | 'PRISON_ADMISSION'
    | 'PRISON_RELEASE'
    | 'PRISON_TRANSFER'
  prison?: Prison
  timestamp?: Date
  correlationId?: string
  contextualInfo?: string
  actionedByDisplayName?: string
}

const baseTimelineEventTemplate = (options?: CoreBuilderOptions): TimelineEvent => {
  return {
    reference: options?.reference || 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
    sourceReference: options?.sourceReference || '1211013',
    eventType: options?.eventType || 'PRISON_ADMISSION',
    prison: {
      prisonId: options?.prison?.prisonId || 'MDI',
      prisonName: undefined,
    },
    timestamp: moment('2023-08-01T10:46:38.565Z').toDate(),
    correlationId: options?.correlationId || '6457a634-6dbe-4179-983b-74e92883232c',
    contextualInfo: options?.contextualInfo,
    actionedByDisplayName: options?.actionedByDisplayName,
  }
}

export default aTimelineEvent
