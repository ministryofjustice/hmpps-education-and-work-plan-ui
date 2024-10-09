import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import { getPreviousPage } from '../../pageFlowHistory'
import validateQualificationLevelForm from '../../validators/induction/qualificationLevelFormValidator'

export default class QualificationLevelCreateController extends QualificationLevelController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    return getPreviousPage(pageFlowHistory)
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    req.session.qualificationLevelForm = { ...req.body }
    const { qualificationLevelForm } = req.session

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/qualification-level`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-details`)
  }
}
