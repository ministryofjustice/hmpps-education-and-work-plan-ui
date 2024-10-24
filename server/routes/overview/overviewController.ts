import createError from 'http-errors'
import { RequestHandler } from 'express'
import type { Goal, PrisonerGoals } from 'viewModels'
import { CuriousService, EducationAndWorkPlanService, InductionService } from '../../services'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import logger from '../../../logger'
import OverviewView from './overviewView'

export default class OverviewController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly inductionService: InductionService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
  ) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    try {
      const [inductionExists, allFunctionalSkills, prisonerGoals] = await Promise.all([
        this.inductionService.inductionExists(prisonNumber, req.user.username),
        this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username),
        this.educationAndWorkPlanService.getAllGoalsForPrisoner(prisonNumber, req.user.username),
      ])

      const isPostInduction = Boolean(inductionExists)
      const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

      const { lastUpdatedBy, lastUpdatedDate, lastUpdatedAtPrisonName, noGoals } =
        this.getLastUpdatedGoalData(prisonerGoals)

      const goalCounts = this.calculateGoalCounts(prisonerGoals.goals)

      const view = new OverviewView(
        prisonerSummary,
        functionalSkills,
        res.locals.curiousInPrisonCourses,
        isPostInduction,
        { lastUpdatedBy, lastUpdatedDate, lastUpdatedAtPrisonName, noGoals, goalCounts },
        prisonerGoals.problemRetrievingData,
      )

      res.render('pages/overview/index', { ...view.renderArgs })
    } catch (error) {
      logger.error(`Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`, error)
      next(createError(500, `Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`))
    }
  }

  private getLastUpdatedGoalData(prisonerGoals: PrisonerGoals) {
    const allGoals: Goal[] = [
      ...prisonerGoals.goals.ACTIVE,
      ...prisonerGoals.goals.ARCHIVED,
      ...prisonerGoals.goals.COMPLETED,
    ]

    if (allGoals.length === 0) {
      return { lastUpdatedBy: null, lastUpdatedDate: null, lastUpdatedAtPrisonName: null, noGoals: true }
    }

    const mostRecentlyUpdatedGoal = this.getMostRecentlyUpdatedGoal(allGoals)
    return {
      lastUpdatedBy: mostRecentlyUpdatedGoal.updatedByDisplayName,
      lastUpdatedDate: mostRecentlyUpdatedGoal.updatedAt,
      lastUpdatedAtPrisonName: mostRecentlyUpdatedGoal.updatedAtPrisonName,
      noGoals: false,
    }
  }

  private calculateGoalCounts(goals: PrisonerGoals['goals']) {
    return {
      activeCount: goals.ACTIVE.length,
      archivedCount: goals.ARCHIVED.length,
      completedCount: goals.COMPLETED.length,
    }
  }

  private getMostRecentlyUpdatedGoal(allGoals: Goal[]): Goal {
    return allGoals.reduce((latestGoal, currentGoal) =>
      !latestGoal || currentGoal.updatedAt > latestGoal.updatedAt ? currentGoal : latestGoal,
    )
  }
}
