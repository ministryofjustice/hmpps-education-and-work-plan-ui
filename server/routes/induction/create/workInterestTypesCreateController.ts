import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import { asArray } from '../../../utils/utils'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`
    return previousPage
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }
    req.session.workInterestTypesForm = workInterestTypesForm

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/work-interest-types`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    req.session.inductionDto = updatedInduction
    req.session.workInterestTypesForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-roles`)
  }
}
