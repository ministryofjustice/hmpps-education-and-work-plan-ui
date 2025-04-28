import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import InPrisonWorkController from '../common/inPrisonWorkController'
import validateInPrisonWorkForm from '../../validators/induction/inPrisonWorkFormValidator'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'

/**
 * Controller for the Update of the In Prison Work screen of the Induction.
 */
export default class InPrisonWorkUpdateController extends InPrisonWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    req.session.inPrisonWorkForm = { ...req.body }
    if (!req.session.inPrisonWorkForm.inPrisonWork) {
      req.session.inPrisonWorkForm.inPrisonWork = []
    }
    if (!Array.isArray(req.session.inPrisonWorkForm.inPrisonWork)) {
      req.session.inPrisonWorkForm.inPrisonWork = [req.session.inPrisonWorkForm.inPrisonWork]
    }
    const { inPrisonWorkForm } = req.session

    const errors = validateInPrisonWorkForm(inPrisonWorkForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/${journeyId}/in-prison-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.journeyData.inductionDto = updatedInduction

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      req.session.inPrisonWorkForm = undefined
      req.journeyData.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
