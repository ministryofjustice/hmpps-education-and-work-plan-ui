import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingView from './additionalTrainingView'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import { asArray } from '../../../utils/utils'
import { clearRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class AdditionalTrainingController {
  /**
   * Returns the Additional Training view; suitable for use by the Create and Update journeys.
   */
  getAdditionalTrainingView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    clearRedirectPendingFlag(req)

    const additionalTrainingForm = invalidForm
      ? {
          additionalTraining: asArray(invalidForm.additionalTraining),
          additionalTrainingOther: invalidForm.additionalTrainingOther,
        }
      : toAdditionalTrainingForm(inductionDto)

    const view = new AdditionalTrainingView(prisonerSummary, additionalTrainingForm)
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
