import { RequestHandler } from 'express'
import EducationAndTrainingView from './educationAndTrainingView'
import OverviewView from './overviewView'
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

export default class OverviewController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly ciagInductionService: CiagInductionService,
  ) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.createGoalForm = undefined

    const { prisonerSummary } = req.session

    const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const allInPrisonEducation = await this.curiousService.getLearnerEducation(prisonNumber, req.user.username)
    const completedInPrisonEducation = mostRecentCompletedInPrisonEducationRecords(allInPrisonEducation, 2)

    const view = new OverviewView(
      prisonNumber,
      prisonerSummary,
      actionPlan,
      functionalSkills,
      completedInPrisonEducation,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
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

    const otherQualifications = await this.ciagInductionService.getOtherQualifications(prisonNumber, req.user.username)

    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      completedInPrisonEducation,
      otherQualifications,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getWorkAndInterestsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const workAndInterests = await this.ciagInductionService.getWorkAndInterests(prisonNumber, req.user.username)

    const view = new WorkAndInterestsView(prisonerSummary, workAndInterests)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
