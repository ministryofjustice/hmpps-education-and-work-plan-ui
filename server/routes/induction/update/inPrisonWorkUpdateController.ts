import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import InPrisonWorkController from '../common/inPrisonWorkController'
import validateInPrisonWorkForm from '../../validators/induction/inPrisonWorkFormValidator'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the In Prison Work screen of the Induction.
 */
export default class InPrisonWorkUpdateController extends InPrisonWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
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
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/in-prison-work`)
    }

    // update the InductionDto with any new values
    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.session.inductionDto = updatedInduction

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inPrisonWorkForm = undefined
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    // if we are switching from the long question set to the short one, forward to the next page in the flow
    if (req.session.updateInductionQuestionSet) {
      req.session.inPrisonWorkForm = undefined
      return res.redirect(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    }

    // otherwise map the InductionDTO to a CreateOrUpdateInductionDTO to call the API
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.inPrisonWorkForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
