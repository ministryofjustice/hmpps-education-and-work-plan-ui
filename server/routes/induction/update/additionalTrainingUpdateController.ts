import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
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
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }
    getPrisonerContext(req.session, prisonNumber).additionalTrainingForm = additionalTrainingForm

    const errors = validateAdditionalTrainingForm(additionalTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/additional-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      getPrisonerContext(req.session, prisonNumber).additionalTrainingForm = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
