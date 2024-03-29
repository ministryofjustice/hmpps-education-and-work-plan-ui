import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AdditionalTrainingForm } from 'inductionForms'
import InductionController from './inductionController'
import AdditionalTrainingView from './additionalTrainingView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class AdditionalTrainingController extends InductionController {
  /**
   * Returns the Additional Training view; suitable for use by the Create and Update journeys.
   */
  getAdditionalTrainingView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    // Check if we are in the midst of changing the main induction question set (e.g. from long route to short route)
    if (req.session.updateInductionQuestionSet) {
      const { prisonNumber } = req.params
      this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/additional-training`)
    }

    const additionalTrainingForm = req.session.additionalTrainingForm || toAdditionalTrainingForm(inductionDto)
    req.session.additionalTrainingForm = undefined

    const view = new AdditionalTrainingView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      additionalTrainingForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/additionalTraining/index', { ...view.renderArgs })
  }
}

const toAdditionalTrainingForm = (inductionDto: InductionDto): AdditionalTrainingForm => {
  return {
    additionalTraining: inductionDto.previousTraining.trainingTypes,
    additionalTrainingOther: inductionDto.previousTraining.trainingTypeOther,
  }
}
