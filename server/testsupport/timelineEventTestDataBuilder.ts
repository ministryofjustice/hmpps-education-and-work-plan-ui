import { parseISO } from 'date-fns'
import type { TimelineEvent } from 'viewModels'

const aTimelineEvent = (options?: CoreBuilderOptions): TimelineEvent => {
  return {
    ...baseTimelineEventTemplate(options),
  }
}

type CoreBuilderOptions = {
  reference?: string
  sourceReference?: string
  eventType?:
    | 'INDUCTION_CREATED'
    | 'INDUCTION_UPDATED'
    | 'INDUCTION_SCHEDULE_STATUS_UPDATED'
    | 'ACTION_PLAN_CREATED'
    | 'GOAL_CREATED'
    | 'MULTIPLE_GOALS_CREATED'
    | 'GOAL_UPDATED'
    | 'GOAL_COMPLETED'
    | 'GOAL_ARCHIVED'
    | 'GOAL_UNARCHIVED'
    | 'STEP_UPDATED'
    | 'STEP_NOT_STARTED'
    | 'STEP_STARTED'
    | 'STEP_COMPLETED'
    | 'ACTION_PLAN_REVIEW_COMPLETED'
    | 'ACTION_PLAN_REVIEW_SCHEDULE_STATUS_UPDATED'
    | 'CONVERSATION_CREATED'
    | 'CONVERSATION_UPDATED'
    | 'PRISON_ADMISSION'
    | 'PRISON_RELEASE'
    | 'PRISON_TRANSFER'
  prisonName?: string
  timestamp?: Date
  correlationId?: string
  contextualInfo?: {
    [key: string]: string
  }
  actionedByDisplayName?: string
}

const baseTimelineEventTemplate = (options?: CoreBuilderOptions): TimelineEvent => {
  return {
    reference: options?.reference || 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
    sourceReference: options?.sourceReference || '1211013',
    eventType: options?.eventType || 'PRISON_ADMISSION',
    prisonName: options?.prisonName || 'Moorland (HMP & YOI)',
    timestamp: parseISO('2023-08-01T10:46:38.565Z'),
    correlationId: options?.correlationId || '6457a634-6dbe-4179-983b-74e92883232c',
    contextualInfo: options?.contextualInfo || {},
    actionedByDisplayName: options?.actionedByDisplayName,
  }
}

export default aTimelineEvent
