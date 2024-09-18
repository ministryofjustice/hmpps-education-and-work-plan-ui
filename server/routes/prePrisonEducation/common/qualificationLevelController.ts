import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelView from './qualificationLevelView'
import getPrisonerContext from '../../../data/session/prisonerContexts'
import EducationController from './educationController'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class QualificationLevelController extends EducationController {
  getQualificationLevelView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const qualificationLevelForm = getPrisonerContext(req.session, prisonNumber).qualificationLevelForm || {
      qualificationLevel: undefined,
    }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    const view = new QualificationLevelView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationLevelForm,
    )
    return res.render('pages/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}
