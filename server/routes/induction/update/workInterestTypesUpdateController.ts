import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import WorkInterestTypesController from '../common/workInterestTypesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for updating a Prisoner's Future Work Interest Types part of an Induction.
 */
export default class WorkInterestTypesUpdateController extends WorkInterestTypesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/plan/${prisonNumber}/view/work-and-interests`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.workInterestTypesForm = { ...req.body }
    if (!req.session.workInterestTypesForm.workInterestTypes) {
      req.session.workInterestTypesForm.workInterestTypes = []
    }
    if (!Array.isArray(req.session.workInterestTypesForm.workInterestTypes)) {
      req.session.workInterestTypesForm.workInterestTypes = [req.session.workInterestTypesForm.workInterestTypes]
    }
    const { workInterestTypesForm } = req.session

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/work-interest-types`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)

    // If the previous page was Check Your Answers, decide whether to redirect back check answers on submission
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.workInterestTypesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
