import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import validateQualificationLevelForm from '../../validators/induction/qualificationLevelFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Qualification Level screen of the Induction.
 */
export default class QualificationLevelUpdateController extends QualificationLevelController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/plan/${prisonNumber}/view/education-and-training`
    return previousPage
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/qualification-level`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-details`)
  }
}
