import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import { asArray } from '../../../utils/utils'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/qualifications`
    return previousPage
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }
    req.session.additionalTrainingForm = additionalTrainingForm

    const errors = validateAdditionalTrainingForm(additionalTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/additional-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    req.session.inductionDto = updatedInduction
    req.session.additionalTrainingForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    // For the Create journey we need the page flow history so subsequent pages know where we have been and can display the correct back link
    req.session.pageFlowHistory = buildNewPageFlowHistory(req)

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/has-worked-before`)
  }
}
