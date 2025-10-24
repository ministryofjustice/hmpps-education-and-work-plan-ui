import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import { asArray } from '../../../utils/utils'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    req.journeyData.inductionDto = updatedInduction

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/has-worked-before`)
  }
}
