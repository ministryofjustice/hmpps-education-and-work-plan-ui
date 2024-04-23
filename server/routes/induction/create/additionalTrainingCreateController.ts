import { NextFunction, Request, RequestHandler, Response } from 'express'
import AdditionalTrainingController from '../common/additionalTrainingController'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import YesNoValue from '../../../enums/yesNoValue'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    return getPreviousPage(pageFlowHistory)
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.additionalTrainingForm = { ...req.body }
    if (!req.session.additionalTrainingForm.additionalTraining) {
      req.session.additionalTrainingForm.additionalTraining = []
    }
    if (!Array.isArray(req.session.additionalTrainingForm.additionalTraining)) {
      req.session.additionalTrainingForm.additionalTraining = [req.session.additionalTrainingForm.additionalTraining]
    }
    const { additionalTrainingForm } = req.session

    const errors = validateAdditionalTrainingForm(additionalTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/additional-training`)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    req.session.inductionDto = updatedInduction
    req.session.additionalTrainingForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    if (updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES) {
      // Long question set Induction
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/has-worked-before`)
    }
    // Short question set Induction
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-work`)
  }
}
