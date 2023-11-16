import createError from 'http-errors'
import { RequestHandler } from 'express'
import EducationAndTrainingView from './educationAndTrainingView'
import SupportNeedsView from './supportNeedsView'
import { CuriousService } from '../../services'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import {
  completedInPrisonEducationRecords,
  mostRecentCompletedInPrisonEducationRecords,
} from '../inPrisonEducationRecordsResolver'
import WorkAndInterestsView from './workAndInterestsView'
import CiagInductionService from '../../services/ciagInductionService'
import PostInductionOverviewView from './postInductionOverviewView'
import PreInductionOverviewView from './preInductionOverviewView'
import TimelineView from './timelineView'

export default class OverviewController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly ciagInductionService: CiagInductionService,
  ) {}

  // TODO - remove this entire method after private beta go-live, once we have switched over to use the PLP Prisoner List and Overview screens rather than the CIAG ones
  getPrivateBetaOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal = undefined
    req.session.newGoals = undefined

    const { prisonerSummary } = req.session

    const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const allInPrisonEducation = await this.curiousService.getLearnerEducation(prisonNumber, req.user.username)
    const completedInPrisonEducation = mostRecentCompletedInPrisonEducationRecords(allInPrisonEducation, 2)

    const view = new PostInductionOverviewView(
      prisonNumber,
      prisonerSummary,
      actionPlan,
      functionalSkills,
      completedInPrisonEducation,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal = undefined
    req.session.newGoals = undefined

    const { prisonerSummary } = req.session

    try {
      const ciagInductionExists = await this.ciagInductionService.ciagInductionExists(prisonNumber, req.user.token)

      const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
      const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

      const allInPrisonEducation = await this.curiousService.getLearnerEducation(prisonNumber, req.user.username)
      const completedInPrisonEducation = mostRecentCompletedInPrisonEducationRecords(allInPrisonEducation, 2)

      let view: PostInductionOverviewView | PreInductionOverviewView
      if (ciagInductionExists) {
        const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)
        view = new PostInductionOverviewView(
          prisonNumber,
          prisonerSummary,
          actionPlan,
          functionalSkills,
          completedInPrisonEducation,
        )
      } else {
        view = new PreInductionOverviewView(prisonNumber, prisonerSummary, functionalSkills, completedInPrisonEducation)
      }

      return res.render('pages/overview/index', { ...view.renderArgs })
    } catch (error) {
      return next(createError(500, `Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`))
    }
  }

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const supportNeeds = await this.curiousService.getPrisonerSupportNeeds(prisonNumber, req.user.username)
    const view = new SupportNeedsView(prisonerSummary, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const allInPrisonEducation = await this.curiousService.getLearnerEducation(prisonNumber, req.user.username)
    const completedInPrisonEducation = completedInPrisonEducationRecords(allInPrisonEducation)

    const educationAndTraining = await this.ciagInductionService.getEducationAndTraining(prisonNumber, req.user.token)
    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      completedInPrisonEducation,
      educationAndTraining,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getWorkAndInterestsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const workAndInterests = await this.ciagInductionService.getWorkAndInterests(prisonNumber, req.user.token)
    const view = new WorkAndInterestsView(prisonerSummary, workAndInterests)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getTimelineView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session

    const view = new TimelineView(prisonerSummary)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
