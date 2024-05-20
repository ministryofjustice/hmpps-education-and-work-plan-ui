import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import AdditionalTrainingController from '../common/additionalTrainingController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateAdditionalTrainingForm from '../../validators/induction/additionalTrainingFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import { asArray } from '../../../utils/utils'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class AdditionalTrainingCreateController extends AdditionalTrainingController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/additional-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)
    req.session.inductionDto = updatedInduction
    req.session.additionalTrainingForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    if (updatedInduction.workOnRelease.hopingToWork === HopingToGetWorkValue.YES) {
      // Long question set Induction
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/has-worked-before`)
    }
    // Short question set Induction
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-work`)
  }
}
