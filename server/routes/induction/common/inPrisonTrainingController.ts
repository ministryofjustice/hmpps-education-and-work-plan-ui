import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, InPrisonTrainingInterestDto } from 'inductionDto'
import type { InPrisonTrainingForm } from 'inductionForms'
import InductionController from './inductionController'
import InPrisonTrainingView from './inPrisonTrainingView'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'
import { asArray } from '../../../utils/utils'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class InPrisonTrainingController extends InductionController {
  /**
   * Returns the In-Prison Training view; suitable for use by the Create and Update journeys.
   */
  getInPrisonTrainingView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const inPrisonTrainingForm = invalidForm
      ? {
          inPrisonTraining: asArray(invalidForm.inPrisonTraining),
          inPrisonTrainingOther: invalidForm.inPrisonTrainingOther,
        }
      : toInPrisonTrainingForm(inductionDto)

    const view = new InPrisonTrainingView(prisonerSummary, inPrisonTrainingForm)
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
