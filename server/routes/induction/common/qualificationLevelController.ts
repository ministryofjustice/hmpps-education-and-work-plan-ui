import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { QualificationLevelForm } from 'inductionForms'
import InductionController from './inductionController'
import QualificationLevelView from './qualificationLevelView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationLevelController extends InductionController {
  /**
   * Returns the Qualification Level view; suitable for use by the Create and Update journeys.
   */
  getQualificationLevelView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const qualificationLevelForm = req.session.qualificationLevelForm || toQualificationLevelForm(inductionDto)
    req.session.qualificationLevelForm = undefined

    const view = new QualificationLevelView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationLevelForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}

const toQualificationLevelForm = (inductionDto: InductionDto): QualificationLevelForm => {
  return {
    educationLevel: inductionDto.previousQualifications?.educationLevel,
    qualificationLevel: undefined,
  }
}
