import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validateQualificationLevelForm from '../../validators/induction/qualificationLevelFormValidator'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'

export default class QualificationLevelCreateController extends QualificationLevelController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-education/highest-level-of-education`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const qualificationLevelForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-education/qualification-level`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-details`)
  }
}
