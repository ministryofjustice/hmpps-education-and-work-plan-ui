import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import validateInPrisonTrainingForm from '../../validators/induction/inPrisonTrainingFormValidator'
import { asArray } from '../../../utils/utils'

export default class InPrisonTrainingCreateController extends InPrisonTrainingController {
  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }
    req.session.inPrisonTrainingForm = inPrisonTrainingForm

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-training`,
        errors,
      )
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)
    req.session.inductionDto = updatedInduction
    req.session.inPrisonTrainingForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/who-completed-induction`)
  }
}
