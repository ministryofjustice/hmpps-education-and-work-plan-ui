import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { Result } from '../../../utils/result/result'
import { asArray } from '../../../utils/utils'

/**
 * Controller for Updating a Prisoner's Additional Training or Vocational Qualifications screen of the Induction.
 */
export default class AdditionalTrainingUpdateController extends AdditionalTrainingController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
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
      return res.redirect('additional-training')
    }

    req.journeyData.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
  }
}
