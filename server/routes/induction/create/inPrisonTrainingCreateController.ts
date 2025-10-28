import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import { asArray } from '../../../utils/utils'

export default class InPrisonTrainingCreateController extends InPrisonTrainingController {
  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)
    req.journeyData.inductionDto = updatedInduction

    return res.redirect(
      req.query?.submitToCheckAnswers === 'true'
        ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
        : `/prisoners/${prisonNumber}/create-induction/${journeyId}/who-completed-induction`,
    )
  }
}
