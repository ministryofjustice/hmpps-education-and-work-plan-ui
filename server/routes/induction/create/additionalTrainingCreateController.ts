import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { getPreviousPage } from '../../pageFlowHistory'
import { asArray } from '../../../utils/utils'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    // TODO - we will need logic here to detect induction question set - Long Question Set goes back to Qualifications, Short Question Set goes back to Do You Want To Add Qualifications
    return `/prisoners/${prisonNumber}/create-induction/qualifications`
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

    const additionalTrainingForm: AdditionalTrainingForm = {
      additionalTraining: asArray(req.body.additionalTraining),
      additionalTrainingOther: req.body.additionalTrainingOther,
    }
    req.session.additionalTrainingForm = additionalTrainingForm

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
