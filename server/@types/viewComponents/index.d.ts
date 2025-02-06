/**
 * Module declaring types that are used by the nunjucks view components
 */
declare module 'viewComponents' {
  import type { Goal, PrisonerSummary } from 'viewModels'
  import type { ActionPlanReviewScheduleView, InductionScheduleView } from '../../routes/overview/overviewViewTypes'

  export interface Action {
    title: string
    href: string
    id?: string
    attributes?: Record<string, string>
    'render-if'?: boolean
  }

  export interface GoalSummaryCardParams {
    id?: string
    attributes?: Record<string, string>
    goal: Goal
    actions: Array<Action>
    lastUpdatedLabel?: string
  }

  export interface ActionsCardParams {
    prisonerSummary: PrisonerSummary
    inductionSchedule: InductionScheduleView
    actionPlanReview: ActionPlanReviewScheduleView
    userHasPermissionTo: () => boolean
    reviewJourneyEnabledForPrison: boolean
  }
}
