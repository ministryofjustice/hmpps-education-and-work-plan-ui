import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateInPrisonTrainingForm from '../../validators/induction/inPrisonTrainingFormValidator'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'

export default class InPrisonTrainingCreateController extends InPrisonTrainingController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/create-induction/in-prison-work`
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const inPrisonTrainingForm: InPrisonTrainingForm = {
      inPrisonTraining: asArray(req.body.inPrisonTraining),
      inPrisonTrainingOther: req.body.inPrisonTrainingOther,
    }
    req.session.inPrisonTrainingForm = inPrisonTrainingForm

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/in-prison-training`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)
    req.session.inductionDto = updatedInduction
    req.session.inPrisonTrainingForm = undefined
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
  }
}
