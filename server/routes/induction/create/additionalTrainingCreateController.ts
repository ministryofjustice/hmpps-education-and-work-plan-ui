import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import { asArray } from '../../../utils/utils'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }
    getPrisonerContext(req.session, prisonNumber).additionalTrainingForm = additionalTrainingForm

    const errors = validateAdditionalTrainingForm(additionalTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/additional-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
    getPrisonerContext(req.session, prisonNumber).additionalTrainingForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/has-worked-before`)
  }
}
