import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateInPrisonTrainingForm from '../../validators/induction/inPrisonTrainingFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'

/**
 * Controller for Updating a Prisoner's In-Prison Education and Training screen of the Induction.
 */
export default class InPrisonTrainingUpdateController extends InPrisonTrainingController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }
    req.session.inPrisonTrainingForm = inPrisonTrainingForm

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/in-prison-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.inPrisonTrainingForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
