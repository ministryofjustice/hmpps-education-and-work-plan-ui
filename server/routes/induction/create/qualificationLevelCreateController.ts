import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'

export default class QualificationLevelCreateController extends QualificationLevelController {
  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const qualificationLevelForm = { ...req.body }
    req.journeyData.qualificationLevel = qualificationLevelForm.qualificationLevel

    return res.redirect('qualification-details')
  }
}
