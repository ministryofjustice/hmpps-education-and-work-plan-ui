import { NextFunction, Request, RequestHandler, Response } from 'express'
import WorkedBeforeController from '../common/workedBeforeController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWorkedBeforeForm from '../../validators/induction/workedBeforeFormValidator'

export default class WorkedBeforeCreateController extends WorkedBeforeController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/additional-training`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.workedBeforeForm = { ...req.body }
    if (!req.session.workedBeforeForm.hasWorkedBefore == null) {
      req.session.workedBeforeForm.hasWorkedBefore = true
    }
    const { workedBeforeForm } = req.session

    const errors = validateWorkedBeforeForm(workedBeforeForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/has-worked-before`)
    }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)
    req.session.inductionDto = updatedInduction
    req.session.workedBeforeForm = undefined

    if (updatedInduction.previousWorkExperiences.hasWorkedBefore) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
    }

    // Prisoner has not worked before; skip straight to work interests post release
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-types`)
  }
}
