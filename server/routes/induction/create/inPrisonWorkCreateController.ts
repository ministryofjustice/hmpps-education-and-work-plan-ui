import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import InPrisonWorkController from '../common/inPrisonWorkController'
import validateInPrisonWorkForm from '../../validators/induction/inPrisonWorkFormValidator'
import { asArray } from '../../../utils/utils'

export default class InPrisonWorkCreateController extends InPrisonWorkController {
  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const inPrisonWorkForm: InPrisonWorkForm = {
      inPrisonWork: asArray(req.body.inPrisonWork),
      inPrisonWorkOther: req.body.inPrisonWorkOther,
    }

    const errors = validateInPrisonWorkForm(inPrisonWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.session.inPrisonWorkForm = inPrisonWorkForm
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.session.inductionDto = updatedInduction

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-training`)
  }
}
