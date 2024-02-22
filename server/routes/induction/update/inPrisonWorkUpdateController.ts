import { NextFunction, Request, RequestHandler, Response } from 'express'
import InPrisonWorkController from '../common/inPrisonWorkController'
import validateInPrisonWorkForm from './inPrisonWorkFormValidator'

/**
 * Controller for the Update of the In Prison Work screen of the Induction.
 */
export default class InPrisonWorkUpdateController extends InPrisonWorkController {
  constructor() {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

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

    // map back to DTO, call service
    req.session.inPrisonWorkForm = undefined
    req.session.inductionDto = undefined

    return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
  }
}
