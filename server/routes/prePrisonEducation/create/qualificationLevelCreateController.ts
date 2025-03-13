import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validateQualificationLevelForm from '../../validators/induction/qualificationLevelFormValidator'

export default class QualificationLevelCreateController extends QualificationLevelController {
  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    const qualificationLevelForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-education/qualification-level`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-details`)
  }
}
