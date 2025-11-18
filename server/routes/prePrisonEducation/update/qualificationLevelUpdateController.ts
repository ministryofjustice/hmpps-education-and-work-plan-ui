import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'

export default class QualificationLevelUpdateController extends QualificationLevelController {
  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    const qualificationLevelForm = { ...req.body }
    req.journeyData.qualificationLevel = qualificationLevelForm.qualificationLevel

    return res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualification-details`)
  }
}
