import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import validateQualificationLevelForm from '../../validators/induction/qualificationLevelFormValidator'

export default class QualificationLevelCreateController extends QualificationLevelController {
  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonerSummary } = res.locals

    req.session.qualificationLevelForm = { ...req.body }
    const { qualificationLevelForm } = req.session

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-level`,
        errors,
      )
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-details`)
  }
}
