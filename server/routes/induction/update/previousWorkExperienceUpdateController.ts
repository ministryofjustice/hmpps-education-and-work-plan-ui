import { NextFunction, Request, RequestHandler, Response } from 'express'
import PreviousWorkExperienceController from '../common/previousWorkExperienceController'
import { InductionService } from '../../../services'
import validatePreviousWorkExperienceForm from './previousWorkExperienceFormValidator'

export default class PreviousWorkExperienceUpdateController extends PreviousWorkExperienceController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitPreviousWorkExperienceForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    req.session.previousWorkExperienceForm = { ...req.body }
    if (!req.session.previousWorkExperienceForm.typeOfWorkExperience) {
      req.session.previousWorkExperienceForm.typeOfWorkExperience = []
    }
    if (!Array.isArray(req.session.previousWorkExperienceForm.typeOfWorkExperience)) {
      req.session.previousWorkExperienceForm.typeOfWorkExperience = [
        req.session.previousWorkExperienceForm.typeOfWorkExperience,
      ]
    }
    const { previousWorkExperienceForm } = req.session

    const errors = validatePreviousWorkExperienceForm(previousWorkExperienceForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    }

    // I think we need to redirect to the next page here, or maybe iterate through redirecting to the next page ?
    return res.redirect(`/prsiners/${prisonNumber}/induction/???the-next-page???`)
  }
}
