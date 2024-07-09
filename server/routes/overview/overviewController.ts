import createError from 'http-errors'
import { RequestHandler } from 'express'
import { CuriousService, InductionService } from '../../services'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import PostInductionOverviewView from './postInductionOverviewView'
import PreInductionOverviewView from './preInductionOverviewView'
import logger from '../../../logger'
import GoalStatusValue from '../../enums/goalStatusValue'

export default class OverviewController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly inductionService: InductionService,
  ) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal = undefined
    req.session.newGoals = undefined

    const { prisonerSummary } = req.session

    try {
      const inductionExists = await this.inductionService.inductionExists(prisonNumber, req.user.username)
      const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
      const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

      const goals = await this.educationAndWorkPlanService.getGoalsByStatus(
        prisonNumber,
        GoalStatusValue.ACTIVE,
        req.user.username,
      )

      let view: PostInductionOverviewView | PreInductionOverviewView
      if (inductionExists) {
        view = new PostInductionOverviewView(
          prisonNumber,
          prisonerSummary,
          goals,
          functionalSkills,
          res.locals.curiousInPrisonCourses,
        )
      } else {
        view = new PreInductionOverviewView(
          prisonNumber,
          prisonerSummary,
          goals,
          functionalSkills,
          res.locals.curiousInPrisonCourses,
        )
      }

      return res.render('pages/overview/index', { ...view.renderArgs })
    } catch (error) {
      logger.error(`Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`, error)
      return next(createError(500, `Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`))
    }
  }
}
