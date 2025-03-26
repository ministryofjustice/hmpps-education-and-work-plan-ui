import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import validateInPrisonTrainingForm from '../../validators/induction/inPrisonTrainingFormValidator'
import { asArray } from '../../../utils/utils'
import config from '../../../config'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class InPrisonTrainingCreateController extends InPrisonTrainingController {
  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }
    getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = inPrisonTrainingForm

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/in-prison-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
    getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    return config.featureToggles.reviewsEnabled
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/who-completed-induction`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
  }
}
