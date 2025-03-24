import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateInPrisonTrainingForm from '../../validators/induction/inPrisonTrainingFormValidator'
import { asArray } from '../../../utils/utils'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Controller for Updating a Prisoner's In-Prison Education and Training screen of the Induction.
 */
export default class InPrisonTrainingUpdateController extends InPrisonTrainingController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }
    getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = inPrisonTrainingForm

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/in-prison-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
