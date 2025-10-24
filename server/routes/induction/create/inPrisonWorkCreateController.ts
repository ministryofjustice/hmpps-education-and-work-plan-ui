import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import InPrisonWorkController from '../common/inPrisonWorkController'
import { asArray } from '../../../utils/utils'

export default class InPrisonWorkCreateController extends InPrisonWorkController {
  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const inPrisonWorkForm: InPrisonWorkForm = {
      inPrisonWork: asArray(req.body.inPrisonWork),
      inPrisonWorkOther: req.body.inPrisonWorkOther,
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.journeyData.inductionDto = updatedInduction

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-training`)
  }
}
