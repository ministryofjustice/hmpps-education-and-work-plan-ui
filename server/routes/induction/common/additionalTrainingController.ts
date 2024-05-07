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

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    // Check if we are in the midst of changing the main induction question set (e.g. from long route to short route)
    // Or if there is an existing page flow
    if (req.session.updateInductionQuestionSet || req.session.pageFlowHistory) {
      this.addCurrentPageToHistory(req)
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

  updatedInductionDtoWithAdditionalTraining(
    inductionDto: InductionDto,
    additionalTrainingForm: AdditionalTrainingForm,
  ): InductionDto {
    return {
      ...inductionDto,
      previousTraining: {
        ...inductionDto.previousTraining,
        trainingTypes: additionalTrainingForm.additionalTraining,
        trainingTypeOther: additionalTrainingForm.additionalTrainingOther,
      },
    }
  }
}

const toAdditionalTrainingForm = (inductionDto: InductionDto): AdditionalTrainingForm => {
  return {
    additionalTraining: [...(inductionDto.previousTraining?.trainingTypes || [])],
    additionalTrainingOther: inductionDto.previousTraining?.trainingTypeOther,
  }
}
