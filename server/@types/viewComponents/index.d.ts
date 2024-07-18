/**
 * Module declaring types that are used by the nunjucks view components
 */
declare module 'viewComponents' {
  import type { Goal } from 'viewModels'

  export interface ActionCardParams {
    id?: string
    attributes?: Record<string, string>
    actions: Array<Action>
  }

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
}
