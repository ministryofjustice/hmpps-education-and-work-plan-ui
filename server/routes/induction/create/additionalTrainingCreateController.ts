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
    const { inductionDto } = req.journeyData

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    req.journeyData.inductionDto = updatedInduction

    return res.redirect(req.query?.submitToCheckAnswers === 'true' ? 'check-your-answers' : 'has-worked-before')
  }
}
