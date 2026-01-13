import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { asArray } from '../../../utils/utils'
import { Result } from '../../../utils/result/result'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const skillsForm: SkillsForm = {
      skills: asArray(req.body.skills),
      skillsOther: req.body.skillsOther,
    }

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('skills')
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
