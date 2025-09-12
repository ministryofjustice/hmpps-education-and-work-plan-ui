import type { ActionPlanReviews, InductionSchedule, PrisonerGoals } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type { OverviewViewRenderArgs } from './overviewViewTypes'
import { toActionPlanReviewScheduleView, toInductionScheduleView } from './overviewViewFunctions'
import { Result } from '../../utils/result/result'

export default class OverviewView {
  constructor(
    private readonly inductionSchedule: InductionSchedule,
    private readonly actionPlanReviews: ActionPlanReviews,
    private readonly prisonerGoals: PrisonerGoals,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
    private readonly prisonNamesById: Result<Record<string, string>>,
  ) {}

  get renderArgs(): OverviewViewRenderArgs {
    const prisonNamesById = this.prisonNamesById.isFulfilled() ? this.prisonNamesById.getOrThrow() : {}

    const allPrisonerGoals = [
      ...this.prisonerGoals.goals.ACTIVE,
      ...this.prisonerGoals.goals.ARCHIVED,
      ...this.prisonerGoals.goals.COMPLETED,
    ]
    const mostRecentlyUpdatedGoal =
      allPrisonerGoals.length > 0
        ? allPrisonerGoals.reduce((latestGoal, currentGoal) =>
            !latestGoal || currentGoal.updatedAt > latestGoal.updatedAt ? currentGoal : latestGoal,
          )
        : undefined

    const prisonerHasHadInduction = // Prisoner is considered to have had their Induction if they have an Induction record AND they have at least 1 goal
      !this.induction.problemRetrievingData && this.induction.inductionDto != null && allPrisonerGoals.length > 0
    const mostRecentReviewSession =
      this.actionPlanReviews?.completedReviews.length > 0
        ? this.actionPlanReviews.completedReviews.reduce((latestReview, currentReview) =>
            !latestReview || currentReview.completedDate > latestReview.completedDate ? currentReview : latestReview,
          )
        : undefined
    const prisonerHasOnlyHadInduction =
      prisonerHasHadInduction && !this.actionPlanReviews?.problemRetrievingData && mostRecentReviewSession == null
    const prisonerHasHadInductionAndAtLeastOneReview = prisonerHasHadInduction && mostRecentReviewSession != null

    let lastSessionConductedBy: string
    let lastSessionConductedAt: Date
    let lastSessionConductedAtPrison: string
    if (prisonerHasOnlyHadInduction) {
      lastSessionConductedBy = this.induction.inductionDto.updatedByDisplayName
      lastSessionConductedAt = this.induction.inductionDto.updatedAt
      lastSessionConductedAtPrison =
        prisonNamesById[this.induction.inductionDto.updatedAtPrison] || this.induction.inductionDto.updatedAtPrison
    } else if (prisonerHasHadInductionAndAtLeastOneReview) {
      lastSessionConductedBy = mostRecentReviewSession.createdByDisplayName
      lastSessionConductedAt = mostRecentReviewSession.createdAt
      lastSessionConductedAtPrison = mostRecentReviewSession.createdAtPrison
    }

    return {
      sessionHistory: {
        problemRetrievingData: !this.actionPlanReviews
          ? this.induction.problemRetrievingData
          : this.induction.problemRetrievingData || this.actionPlanReviews.problemRetrievingData,
        counts: {
          totalCompletedSessions: prisonerHasHadInduction
            ? 1 + (this.actionPlanReviews?.completedReviews.length || 0) // 1 (for the Induction), plus the number of completed Reviews
            : 0, // If the prisoner has not had their Induction, by definition they cannot have had any Reviews, so the total complete sessions is 0
          reviewSessions: this.actionPlanReviews ? this.actionPlanReviews.completedReviews.length : undefined,
          inductionSessions: prisonerHasHadInduction ? 1 : 0,
        },
        lastSessionConductedBy,
        lastSessionConductedAt,
        lastSessionConductedAtPrison,
      },
      induction: {
        problemRetrievingData: this.induction.problemRetrievingData,
        isPostInduction: !this.induction.problemRetrievingData ? this.induction.inductionDto != null : undefined,
      },
      prisonerGoals: {
        problemRetrievingData: this.prisonerGoals.problemRetrievingData,
        counts: {
          activeGoals: this.prisonerGoals.goals.ACTIVE.length,
          archivedGoals: this.prisonerGoals.goals.ARCHIVED.length,
          completedGoals: this.prisonerGoals.goals.COMPLETED.length,
          totalGoals: allPrisonerGoals.length,
        },
        lastUpdatedBy: mostRecentlyUpdatedGoal?.updatedByDisplayName,
        lastUpdatedDate: mostRecentlyUpdatedGoal?.updatedAt,
        lastUpdatedAtPrisonName: mostRecentlyUpdatedGoal?.updatedAtPrisonName,
      },
      inductionSchedule: toInductionScheduleView(this.inductionSchedule, this.induction.inductionDto),
      actionPlanReview: toActionPlanReviewScheduleView(this.actionPlanReviews),
    }
  }
}
