import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'

export default class QualificationLevelCreateController extends QualificationLevelController {
  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    req.session.qualificationLevelForm = { ...req.body }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-details`)
  }
}
