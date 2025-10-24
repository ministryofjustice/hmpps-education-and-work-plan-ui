import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import InPrisonWorkController from '../common/inPrisonWorkController'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { Result } from '../../../utils/result/result'
import { asArray } from '../../../utils/utils'

/**
 * Controller for the Update of the In Prison Work screen of the Induction.
 */
export default class InPrisonWorkUpdateController extends InPrisonWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const inPrisonWorkForm: InPrisonWorkForm = {
      inPrisonWork: asArray(req.body.inPrisonWork),
      inPrisonWorkOther: req.body.inPrisonWorkOther,
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.journeyData.inductionDto = updatedInduction

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('in-prison-work')
    }

    req.journeyData.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
