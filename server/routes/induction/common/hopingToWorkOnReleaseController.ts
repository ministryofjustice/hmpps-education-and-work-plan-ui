import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import InductionController from './inductionController'
import HopingToWorkOnReleaseView from './hopingToWorkOnReleaseView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class HopingToWorkOnReleaseController extends InductionController {
  /**
   * Returns the Hoping To Work On Release view; suitable for use by the Create and Update journeys.
   */
  getHopingToWorkOnReleaseView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    if (req.session.pageFlowHistory) {
      const { prisonNumber } = req.params
      this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    }

    const hopingToWorkOnReleaseForm = req.session.hopingToWorkOnReleaseForm || toHopingToWorkOnReleaseForm(inductionDto)
    req.session.hopingToWorkOnReleaseForm = undefined

    const view = new HopingToWorkOnReleaseView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      hopingToWorkOnReleaseForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/hopingToWorkOnRelease/index', { ...view.renderArgs })
  }
}

const toHopingToWorkOnReleaseForm = (inductionDto: InductionDto): HopingToWorkOnReleaseForm => {
  return {
    hopingToGetWork: inductionDto.workOnRelease?.hopingToWork,
  }
}
