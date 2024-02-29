import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import InductionController from './inductionController'
import ReasonsNotToGetWorkView from './reasonsNotToGetWorkView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class ReasonsNotToGetWorkController extends InductionController {
  /**
   * Returns the Reasons Not To Get Work view; suitable for use by the Create and Update journeys.
   */
  getReasonsNotToGetWorkView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const reasonsNotToGetWorkForm = req.session.reasonsNotToGetWorkForm || toReasonsNotToGetWorkForm(inductionDto)
    req.session.reasonsNotToGetWorkForm = undefined

    const view = new ReasonsNotToGetWorkView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      reasonsNotToGetWorkForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/reasonsNotToGetWork/index', { ...view.renderArgs })
  }
}

const toReasonsNotToGetWorkForm = (inductionDto: InductionDto): ReasonsNotToGetWorkForm => {
  return {
    reasonsNotToGetWork: inductionDto.workOnRelease.notHopingToWorkReasons,
    reasonsNotToGetWorkOther: inductionDto.workOnRelease.notHopingToWorkOtherReason,
  }
}
