import createError from 'http-errors'
import { RequestHandler } from 'express'
import EducationAndTrainingView from './educationAndTrainingView'
import SupportNeedsView from './supportNeedsView'
import { CuriousService } from '../../services'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import TimelineService from '../../services/timelineService'
import PrisonService from '../../services/prisonService'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import {
  completedInPrisonEducationRecords,
  mostRecentCompletedInPrisonEducationRecords,
} from '../inPrisonEducationRecordsResolver'
import filterTimelineEvents from '../timelineResolver'
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
    private readonly timelineService: TimelineService,
    private readonly prisonService: PrisonService,
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

      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)

      let view: PostInductionOverviewView | PreInductionOverviewView
      if (ciagInductionExists) {
        view = new PostInductionOverviewView(
          prisonNumber,
          prisonerSummary,
          actionPlan,
          functionalSkills,
          completedInPrisonEducation,
        )
      } else {
        view = new PreInductionOverviewView(
          prisonNumber,
          prisonerSummary,
          actionPlan,
          functionalSkills,
          completedInPrisonEducation,
        )
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

    // Loop through the healthAndSupport needs array and update the prison name for each need
    if (supportNeeds.healthAndSupportNeeds) {
      await Promise.all(
        supportNeeds.healthAndSupportNeeds.map(async supportNeed => {
          const prison = await this.prisonService.lookupPrison(supportNeed.prisonId, req.user.username)
          if (prison) {
            // TODO refactor to avoid param-reassign eslint rule
            // eslint-disable-next-line no-param-reassign
            supportNeed.prisonName = prison.prisonName
          }
        }),
      )
    }

    // Loop through the neurodiversities needs array and update the prison name for each need
    if (supportNeeds.neurodiversities) {
      await Promise.all(
        supportNeeds.neurodiversities.map(async supportNeed => {
          const prison = await this.prisonService.lookupPrison(supportNeed.prisonId, req.user.username)
          if (prison) {
            // TODO refactor to avoid param-reassign eslint rule
            // eslint-disable-next-line no-param-reassign
            supportNeed.prisonName = prison.prisonName
          }
        }),
      )
    }

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
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allTimelineEvents = await this.timelineService.getTimeline(prisonNumber, req.user.token, req.user.username)
    const timeline = filterTimelineEvents(allTimelineEvents)
    const view = new TimelineView(prisonerSummary, timeline)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
