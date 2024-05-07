import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, InPrisonTrainingInterestDto } from 'inductionDto'
import type { InPrisonTrainingForm } from 'inductionForms'
import InductionController from './inductionController'
import InPrisonTrainingView from './inPrisonTrainingView'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class InPrisonTrainingController extends InductionController {
  /**
   * Returns the In-Prison Training view; suitable for use by the Create and Update journeys.
   */
  getInPrisonTrainingView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    // Check if we are in the midst of changing the main induction question set (in this case from long route to short route)
    if (req.session.updateInductionQuestionSet) {
      this.addCurrentPageToHistory(req)
    }

    const inPrisonTrainingForm = req.session.inPrisonTrainingForm || toInPrisonTrainingForm(inductionDto)
    req.session.inPrisonTrainingForm = undefined

    const view = new InPrisonTrainingView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      inPrisonTrainingForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/inPrisonTraining/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithInPrisonTraining(
    inductionDto: InductionDto,
    inPrisonTrainingForm: InPrisonTrainingForm,
  ): InductionDto {
    const updatedPrisonTrainingInterests: InPrisonTrainingInterestDto[] = inPrisonTrainingForm.inPrisonTraining.map(
      training => {
        return {
          trainingType: training,
          trainingTypeOther:
            training === InPrisonTrainingValue.OTHER ? inPrisonTrainingForm.inPrisonTrainingOther : undefined,
        }
      },
    )
    return {
      ...inductionDto,
      inPrisonInterests: {
        ...inductionDto.inPrisonInterests,
        inPrisonTrainingInterests: updatedPrisonTrainingInterests,
      },
    }
  }
}

const toInPrisonTrainingForm = (inductionDto: InductionDto): InPrisonTrainingForm => {
  return {
    inPrisonTraining:
      inductionDto.inPrisonInterests?.inPrisonTrainingInterests?.map(training => training.trainingType) || [],
    inPrisonTrainingOther: inductionDto.inPrisonInterests?.inPrisonTrainingInterests?.find(
      training => training.trainingType === InPrisonTrainingValue.OTHER,
    )?.trainingTypeOther,
  }
}
