import type { ActionPlanReviews, Goal, InductionSchedule, PrisonerGoals, PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import { ActionPlanReviewScheduleView, InductionScheduleView } from './overviewViewTypes'
import { toActionPlanReviewScheduleView, toInductionScheduleView } from './overviewViewFunctions'

export default class ViewGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly allGoalsForPrisoner: PrisonerGoals,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
    private readonly actionPlanReviews: ActionPlanReviews,
    private readonly inductionSchedule: InductionSchedule,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    problemRetrievingData: boolean
    inProgressGoals: Array<Goal>
    archivedGoals: Array<Goal>
    completedGoals: Array<Goal>
    inductionSchedule: InductionScheduleView
    actionPlanReview: ActionPlanReviewScheduleView
  } {
    return {
      tab: 'goals',
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.allGoalsForPrisoner.problemRetrievingData,
      inProgressGoals: this.allGoalsForPrisoner.goals.ACTIVE,
      archivedGoals: this.allGoalsForPrisoner.goals.ARCHIVED,
      completedGoals: this.allGoalsForPrisoner.goals.COMPLETED,
      inductionSchedule: toInductionScheduleView(this.inductionSchedule, this.induction.inductionDto),
      actionPlanReview: toActionPlanReviewScheduleView(this.actionPlanReviews),
    }
  }
}
