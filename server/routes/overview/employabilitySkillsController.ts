import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionSchedule } from 'viewModels'
import { Result } from '../../utils/result/result'
import { workOutInductionStatus } from './overviewViewFunctions'

export default class EmployabilitySkillsController {
  getEmployabilitySkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, employabilitySkills, induction, inductionSchedule } = res.locals

    res.render('pages/overview/index', {
      tab: 'employability-skills',
      prisonerSummary,
      employabilitySkills,
      induction,
      inductionStatus: inductionStatus(induction, inductionSchedule),
    })
  }
}

const inductionStatus = (induction: Result<InductionDto>, inductionSchedule: Result<InductionSchedule>) => {
  if (inductionSchedule.isFulfilled() && induction.isFulfilled()) {
    return Result.fulfilled(workOutInductionStatus(inductionSchedule.getOrNull(), induction.getOrNull()))
  }

  return Result.rewrapRejected(induction, inductionSchedule)
}
