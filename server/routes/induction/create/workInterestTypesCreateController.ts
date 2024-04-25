import { NextFunction, Request, RequestHandler, Response } from 'express'
import WorkInterestTypesController from '../common/workInterestTypesController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/has-worked-before`
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
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-types`)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    req.session.inductionDto = updatedInduction
    req.session.workInterestTypesForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-roles`)
  }
}
