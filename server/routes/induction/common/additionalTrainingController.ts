import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AdditionalTrainingForm } from 'inductionForms'
import InductionController from './inductionController'
import AdditionalTrainingView from './additionalTrainingView'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

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

    if (req.session.pageFlowHistory) {
      this.addCurrentPageToHistory(req)
    }

    const additionalTrainingForm = req.session.additionalTrainingForm || toAdditionalTrainingForm(inductionDto)
    req.session.additionalTrainingForm = undefined

    const view = new AdditionalTrainingView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      additionalTrainingForm,
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
        trainingTypeOther: additionalTrainingForm.additionalTraining.includes(AdditionalTrainingValue.OTHER)
          ? additionalTrainingForm.additionalTrainingOther
          : undefined,
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
