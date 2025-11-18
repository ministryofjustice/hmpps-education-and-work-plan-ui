import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelView from './qualificationLevelView'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class QualificationLevelController {
  getQualificationLevelView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, invalidForm } = res.locals

    const qualificationLevelForm = invalidForm ?? {
      qualificationLevel: undefined,
    }

    const view = new QualificationLevelView(prisonerSummary, qualificationLevelForm)
    return res.render('pages/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}
